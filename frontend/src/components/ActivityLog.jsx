import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ActivityLog.css';

const ActivityLog = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ limit: 50, offset: 0 });
  const [filters, setFilters] = useState({
    activityType: '',
    startDate: '',
    endDate: '',
  });
  const [exporting, setExporting] = useState(false);

  const activityTypeOptions = [
    'LOCATION_UPDATE',
    'LOCATION_SHARED',
    'GEOFENCE_ENTRY',
    'GEOFENCE_EXIT',
    'APP_LAUNCH',
    'APP_CLOSE',
    'BATTERY_CHANGE',
    'CONNECTIVITY_CHANGE',
    'LOGIN',
    'LOGOUT',
    'SETTING_CHANGE',
    'PAYMENT_COMPLETED',
    'PAYMENT_FAILED',
    'ACCOUNT_CREATED',
    'PROFILE_UPDATED',
  ];

  // Fetch activities
  useEffect(() => {
    fetchActivities();
  }, [pagination, filters]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = {
        limit: pagination.limit,
        offset: pagination.offset,
        ...filters,
      };

      const response = await axios.get(`/api/activities/user/${userId}`, { params });
      setActivities(response.data.data);
      setPagination(prev => ({
        ...prev,
        total: response.data.total,
      }));
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
    }));
    setPagination(prev => ({ ...prev, offset: 0 }));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await axios.get(`/api/activities/export`, {
        params: { format: 'csv' },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'activities.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error exporting activities:', error);
    } finally {
      setExporting(false);
    }
  };

  const getActivityIcon = (type) => {
    const iconMap = {
      LOCATION_UPDATE: '📍',
      LOCATION_SHARED: '🔗',
      GEOFENCE_ENTRY: '🎯',
      GEOFENCE_EXIT: '🏁',
      APP_LAUNCH: '▶️',
      APP_CLOSE: '⏹️',
      BATTERY_CHANGE: '🔋',
      CONNECTIVITY_CHANGE: '📡',
      LOGIN: '🔓',
      LOGOUT: '🔐',
      SETTING_CHANGE: '⚙️',
      PAYMENT_COMPLETED: '✅',
      PAYMENT_FAILED: '❌',
      ACCOUNT_CREATED: '👤',
      PROFILE_UPDATED: '📝',
    };
    return iconMap[type] || '📋';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="activity-log">
      <div className="activity-header">
        <h2>Activity Log</h2>
        <button
          className="export-btn"
          onClick={handleExport}
          disabled={exporting}
        >
          {exporting ? 'Exporting...' : '📥 Export as CSV'}
        </button>
      </div>

      <div className="activity-filters">
        <select
          name="activityType"
          value={filters.activityType}
          onChange={handleFilterChange}
          className="filter-input"
        >
          <option value="">All Activity Types</option>
          {activityTypeOptions.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="filter-input"
          placeholder="Start Date"
        />

        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="filter-input"
          placeholder="End Date"
        />
      </div>

      {loading ? (
        <div className="loading">Loading activities...</div>
      ) : (
        <>
          <div className="activity-list">
            {activities.length === 0 ? (
              <p className="no-activities">No activities found</p>
            ) : (
              activities.map(activity => (
                <div key={activity.id} className="activity-item">
                  <div className="activity-icon">
                    {getActivityIcon(activity.activityType)}
                  </div>
                  <div className="activity-content">
                    <div className="activity-type">
                      {activity.activityType.replace(/_/g, ' ')}
                    </div>
                    {activity.description && (
                      <div className="activity-description">
                        {activity.description}
                      </div>
                    )}
                    {activity.device && (
                      <div className="activity-device">
                        Device: {activity.device.deviceName}
                      </div>
                    )}
                    <div className="activity-meta">
                      <span className={`activity-status ${activity.status.toLowerCase()}`}>
                        {activity.status}
                      </span>
                      <span className={`activity-severity ${activity.severity.toLowerCase()}`}>
                        {activity.severity}
                      </span>
                      <span className="activity-time">
                        {formatDate(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {pagination.total > pagination.limit && (
            <div className="activity-pagination">
              <button
                disabled={pagination.offset === 0}
                onClick={() =>
                  setPagination(prev => ({
                    ...prev,
                    offset: Math.max(0, prev.offset - prev.limit),
                  }))
                }
              >
                Previous
              </button>
              <span>
                Page {Math.floor(pagination.offset / pagination.limit) + 1} of{' '}
                {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <button
                disabled={pagination.offset + pagination.limit >= pagination.total}
                onClick={() =>
                  setPagination(prev => ({
                    ...prev,
                    offset: prev.offset + prev.limit,
                  }))
                }
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivityLog;
import React from 'react';
import { useEcoSync } from '../../context/EcoSyncContext.jsx';


export default function NotificationDrawer() {
  const {
    activeModal,
    setActiveModal,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useEcoSync();

  const isOpen = activeModal === 'notification_drawer';

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 glass-modal-bg flex justify-end transition-opacity duration-300"
      onClick={() => setActiveModal(null)}
    >
      <div
        className="w-full max-w-md h-full bg-surface-container-lowest shadow-2xl flex flex-col justify-between animate-slide-left p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/15">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl">notifications</span>
              <h3 className="font-headline font-bold text-xl text-on-surface">Notifications</h3>
            </div>
            <button
              onClick={() => setActiveModal(null)}
              className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-all"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* Actions Bar */}
          <div className="flex items-center justify-between py-3 text-xs text-outline">
            <span>{notifications.length} updates logged</span>
            <button
              onClick={markAllNotificationsAsRead}
              className="text-primary font-bold hover:underline"
            >
              Mark all as read
            </button>
          </div>

          {/* List */}
          <div className="space-y-3 mt-2 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-outline">
                <span className="material-symbols-outlined text-4xl mb-2">notifications_off</span>
                <p className="font-medium text-sm">No new notifications</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const iconColor =
                  notif.severity === 'warning'
                    ? 'text-error'
                    : notif.category === 'water'
                    ? 'text-secondary'
                    : 'text-primary';

                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationAsRead(notif.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      notif.unread
                        ? 'bg-surface-container-low border-primary-fixed/40'
                        : 'bg-surface-container-lowest border-outline-variant/10 opacity-75'
                    } hover:bg-surface-container`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0">
                        <span className={`material-symbols-outlined text-base ${iconColor}`}>
                          {notif.icon}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="font-headline font-bold text-xs text-on-surface">
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-outline ml-2">{notif.timestamp}</span>
                        </div>
                        <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <button
          onClick={() => setActiveModal(null)}
          className="w-full py-2.5 bg-surface-container text-on-surface font-semibold rounded-xl text-sm hover:bg-surface-container-high transition-all mt-4"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}

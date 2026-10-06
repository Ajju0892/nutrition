import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    category: { type: String, default: 'grid' },
    severity: { type: String, default: 'info' },
    timestamp: { type: String, default: 'Just now' },
    unread: { type: Boolean, default: true },
    icon: { type: String, default: 'notifications' }
  },
  { timestamps: true }
);

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

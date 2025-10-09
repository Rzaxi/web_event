import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const AttendanceStatusBadge = ({ status }) => {
  let bgColor, textColor, Icon, text;

  switch (status) {
    case 'present':
      bgColor = 'bg-green-100';
      textColor = 'text-green-800';
      Icon = CheckCircle;
      text = 'Hadir';
      break;
    case 'absent':
      bgColor = 'bg-red-100';
      textColor = 'text-red-800';
      Icon = XCircle;
      text = 'Tidak Hadir';
      break;
    default:
      bgColor = 'bg-yellow-100';
      textColor = 'text-yellow-800';
      Icon = Clock;
      text = 'Pending';
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
      <Icon className="h-3 w-3 mr-1" />
      {text}
    </span>
  );
};

export default AttendanceStatusBadge;

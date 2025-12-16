import { motion } from 'motion/react';

export default function SkeletonRow() {
  return (
    <tr className="hover:bg-gray-50">
      {/* Checkbox */}
      <td className="px-6 py-4">
        <div className="w-4 h-4 bg-gray-200 rounded animate-pulse" />
      </td>

      {/* Name with Avatar */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
            <div className="w-24 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </td>

      {/* Level Badge */}
      <td className="px-6 py-4">
        <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
      </td>

      {/* Score with Progress Bar */}
      <td className="px-6 py-4">
        <div className="w-24 h-2 bg-gray-200 rounded-full animate-pulse" />
      </td>

      {/* Best Fit Description */}
      <td className="px-6 py-4">
        <div className="w-40 h-4 bg-gray-200 rounded animate-pulse" />
      </td>

      {/* Skills Tags */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-1.5">
          <div className="w-16 h-6 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-16 h-6 bg-gray-200 rounded-md animate-pulse" />
          <div className="w-8 h-6 bg-gray-200 rounded-md animate-pulse" />
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4">
        <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
      </td>

      {/* Notes Icon */}
      <td className="px-6 py-4">
        <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
      </td>
    </tr>
  );
}

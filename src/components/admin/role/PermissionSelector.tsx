import React, { useState } from 'react';
import { IPermission } from '../../../types/backend';

interface PermissionSelectorProps {
    permissionsByDomain: Record<string, IPermission[]>;
    onPermissionToggle: (permission: IPermission) => void;
    onDomainToggle: (domain: string) => void;
    isPermissionSelected: (permissionId: number) => boolean;
    isDomainFullySelected: (domain: string) => boolean;
    isDomainPartiallySelected: (domain: string) => boolean;
}

// Helper function to get method color
const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
        case 'GET':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'POST':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'PUT':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'DELETE':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const PermissionSelector: React.FC<PermissionSelectorProps> = ({
    permissionsByDomain,
    onPermissionToggle,
    onDomainToggle,
    isPermissionSelected,
    isDomainFullySelected,
    isDomainPartiallySelected
}) => {
    const [expandedDomains, setExpandedDomains] = useState<Record<string, boolean>>({});

    const toggleDomainExpansion = (domain: string) => {
        setExpandedDomains(prev => ({
            ...prev,
            [domain]: !prev[domain]
        }));
    };

    const isDomainExpanded = (domain: string) => {
        return expandedDomains[domain] !== false; // Default to expanded
    };
    return (
        <div className="max-h-96 overflow-y-auto border border-base-300 rounded-lg p-4">
            {Object.keys(permissionsByDomain).length === 0 ? (
                <div className="text-center text-gray-500 py-4">
                    Đang tải danh sách quyền hạn...
                </div>
            ) : (
                Object.entries(permissionsByDomain).map(([domain, permissions]) => (
                    <div key={domain} className="mb-6">
                        {/* Domain Header */}
                        <div className="flex items-center gap-2 mb-3">
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
                                checked={isDomainFullySelected(domain)}
                                ref={(el) => {
                                    if (el) {
                                        el.indeterminate = isDomainPartiallySelected(domain);
                                    }
                                }}
                                onChange={() => onDomainToggle(domain)}
                            />
                            <button
                                type="button"
                                onClick={() => toggleDomainExpansion(domain)}
                                className="flex items-center gap-2 hover:bg-base-100 p-1 rounded transition-colors"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${isDomainExpanded(domain) ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="font-semibold text-base-content text-lg">
                                    {domain}
                                </span>
                                <span className="text-sm text-base-content/70">
                                    ({permissions.length} quyền)
                                </span>
                            </button>
                        </div>

                        {/* Permissions Grid - 4 columns */}
                        {isDomainExpanded(domain) && (
                            <div className="ml-6 grid grid-cols-4 gap-3">
                                {permissions.map((permission) => (
                                    <div key={permission.id} className="flex flex-col gap-2 p-3 border border-base-200 rounded-lg hover:bg-base-50 transition-colors">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-sm"
                                                checked={isPermissionSelected(permission.id)}
                                                onChange={() => onPermissionToggle(permission)}
                                            />
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getMethodColor(permission.method)}`}>
                                                {permission.method}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-base-content mb-1 line-clamp-2">
                                                {permission.name}
                                            </div>
                                            <div className="text-xs text-base-content/60 truncate">
                                                {permission.apiPath}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

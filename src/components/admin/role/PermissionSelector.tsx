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

// Helper function to get method badge class for DaisyUI
const getMethodBadgeClass = (method: string) => {
    switch (method.toUpperCase()) {
        case 'GET':
            return 'badge-info';
        case 'POST':
            return 'badge-success';
        case 'PUT':
            return 'badge-warning';
        case 'DELETE':
            return 'badge-error';
        case 'PATCH':
            return 'badge-secondary';
        default:
            return 'badge-neutral';
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
        <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
                <div className="max-h-96 overflow-y-auto">
                    {Object.keys(permissionsByDomain).length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8">
                            <div className="loading loading-spinner loading-lg text-primary"></div>
                            <p className="text-base-content/60 mt-2">Đang tải danh sách quyền hạn...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {Object.entries(permissionsByDomain).map(([domain, permissions]) => (
                                <div key={domain} className="collapse collapse-arrow bg-base-200">
                                    <input
                                        type="checkbox"
                                        checked={isDomainExpanded(domain)}
                                        onChange={() => toggleDomainExpansion(domain)}
                                    />
                                    <div className="collapse-title text-lg font-medium flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            className="checkbox checkbox-primary checkbox-sm"
                                            checked={isDomainFullySelected(domain)}
                                            ref={(el) => {
                                                if (el) {
                                                    el.indeterminate = isDomainPartiallySelected(domain);
                                                }
                                            }}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                onDomainToggle(domain);
                                            }}
                                        />
                                        <span className="text-base-content font-semibold">
                                            {domain}
                                        </span>
                                        <span className="badge badge-neutral badge-sm">
                                            {permissions.length} quyền
                                        </span>
                                    </div>

                                    <div className="collapse-content">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-4">
                                            {permissions.map((permission) => (
                                                <div
                                                    key={permission.id}
                                                    className={`card bg-base-100 border-2 transition-all duration-200 hover:shadow-md ${isPermissionSelected(permission.id)
                                                        ? 'border-primary shadow-md'
                                                        : 'border-base-200'
                                                        }`}
                                                >
                                                    <div className="card-body p-3">
                                                        <div className="flex items-start gap-3">
                                                            <input
                                                                type="checkbox"
                                                                className="checkbox checkbox-primary checkbox-sm mt-1"
                                                                checked={isPermissionSelected(permission.id)}
                                                                onChange={() => onPermissionToggle(permission)}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className={`badge badge-sm ${getMethodBadgeClass(permission.method)}`}>
                                                                        {permission.method}
                                                                    </div>
                                                                </div>
                                                                <h4 className="font-medium text-base-content text-sm mb-1 line-clamp-2">
                                                                    {permission.name}
                                                                </h4>
                                                                <p className="text-xs text-base-content/60 truncate font-mono">
                                                                    {permission.apiPath}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

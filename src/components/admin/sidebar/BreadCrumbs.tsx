import { Link } from "react-router-dom";

export interface BreadCrumbItem {
    label: string;
    path?: string;
}

interface BreadCrumbsProps {
    items: BreadCrumbItem[];
}

export const BreadCrumbs: React.FC<BreadCrumbsProps> = ({ items }) => {
    return (
        <div className="breadcrumbs text-sm">
            <ul>
                {items.map((item, idx) => (
                    <li key={idx}>
                        {item.path ? (
                            <Link to={item.path}>{item.label}</Link>
                        ) : (
                            <span>{item.label}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};
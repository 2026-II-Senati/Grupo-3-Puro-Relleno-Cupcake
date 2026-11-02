import Card from '../../../components/Card/Card';

import type {
    StatCardTone,
} from '../types/Dashboard';

interface StatCardProps {
    label: string;
    value: number;
    description: string;
    icon: string;
    tone: StatCardTone;
}

export default function StatCard({
                                     label,
                                     value,
                                     description,
                                     icon,
                                     tone,
                                 }: StatCardProps) {
    return (
        <Card
            className={`prc-dashboard-stat prc-dashboard-stat--${tone}`}
        >
            <div className="prc-dashboard-stat-header">
        <span className="prc-dashboard-stat-label">
          {label}
        </span>

                <span
                    className="prc-dashboard-stat-icon"
                    aria-hidden="true"
                >
          {icon}
        </span>
            </div>

            <strong className="prc-dashboard-stat-value">
                {value}
            </strong>

            <p className="prc-dashboard-stat-description">
                {description}
            </p>
        </Card>
    );
}
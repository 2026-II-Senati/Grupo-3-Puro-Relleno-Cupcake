import AgendaPage from '../features/agenda/AgendaPage';

import { sampleOrders } from '../features/orders/management/data/sampleOrders';

export function Agenda() {
    return (
        <AgendaPage
            orders={sampleOrders}
        />
    );
}
import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { EscapeRoomList } from './pages/escape-room-list/escape-room-list';
import { EscapeRoomDetail } from './pages/escape-room-detail/escape-room-detail';
import { EscapeRoomCreate } from './pages/escape-room-create/escape-room-create';
import { EscapeRoomUpdate } from './pages/escape-room-update/escape-room-update';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: Layout,
        children: [
            {
                path: 'escape-room-list',
                component: EscapeRoomList
            },
            {
                path: 'escape-room-detail/:id',
                component: EscapeRoomDetail
            },
            {
                path: 'escape-room-create',
                component: EscapeRoomCreate
            },
            {
                path: 'escape-room-edit/:id',
                component: EscapeRoomUpdate
            }
        ]
    }
];

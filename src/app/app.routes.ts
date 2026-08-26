import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { EscapeRoomList } from './pages/escape-room-list/escape-room-list';
import { EscapeRoomDetail } from './pages/escape-room-detail/escape-room-detail';
import { EscapeRoomCreate } from './pages/escape-room-create/escape-room-create';
import { EscapeRoomUpdate } from './pages/escape-room-update/escape-room-update';
import { BookList } from './pages/book-list/book-list';
import { BookDetail } from './pages/book-detail/book-detail';
import { BookCreate } from './pages/book-create/book-create';
import { BookUpdate } from './pages/book-update/book-update';

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
            },
            {
                path: 'book-list',
                component: BookList
            },
            {
                path: 'book-detail/:id',
                component: BookDetail
            },
            {
                path: 'book-create',
                component: BookCreate
            },
            {
                path: 'book-edit/:id',
                component: BookUpdate
            }
        ]
    }
];

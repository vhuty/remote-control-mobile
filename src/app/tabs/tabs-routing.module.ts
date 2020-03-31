import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'devices',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../devices/devices.module').then(m => m.DevicesModule)
          }
        ]
      },
      {
        path: 'binding',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../binding/binding.module').then(m => m.BindingModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: '/tabs/devices',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/devices',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}

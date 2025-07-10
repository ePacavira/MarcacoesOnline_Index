import { Component, type OnInit, signal } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-header">
      <h2 class="dashboard-title">Dashboard</h2>
      <input class="dashboard-search" placeholder="Search something..." />
      <div class="dashboard-user">
        <span class="user-name">Your Name</span>
        <span class="user-role">Administrator</span>
        <img class="user-avatar" src="/user.jpg" alt="User" />
      </div>
    </div>
    <div class="dashboard-cards">
      <div class="dashboard-card green">
        <div class="card-title">$513</div>
        <div class="card-desc">Total Revenue</div>
        <div class="card-extra">+12%</div>
      </div>
      <div class="dashboard-card yellow">
        <div class="card-title">321</div>
        <div class="card-desc">Total Transaction</div>
        <div class="card-extra">+0.9%</div>
      </div>
      <div class="dashboard-card red">
        <div class="card-title">564</div>
        <div class="card-desc">Total Products</div>
        <div class="card-extra">+13%</div>
      </div>
      <div class="dashboard-card blue">
        <div class="card-title">254</div>
        <div class="card-desc">Total Customer</div>
        <div class="card-extra">-0.4%</div>
      </div>
    </div>
    <div class="dashboard-main-content">
      <div class="dashboard-main-left">
        <div class="dashboard-panel">
          <div class="panel-header">
            Revenue Growth
            <div class="panel-tabs">
              <span class="active">Day</span>
              <span>Weekly</span>
              <span>Monthly</span>
            </div>
          </div>
          <div class="panel-chart">
            <!-- Placeholder para gráfico -->
            <div class="chart-placeholder">[Gráfico de barras/linhas]</div>
          </div>
        </div>
        <div class="dashboard-panel">
          <div class="panel-header">Last Order</div>
          <div class="panel-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Product</th><th>Date</th><th>Status</th><th>Tracking</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>#00124</td><td>Iphone 14</td><td>01 Jan 2023</td><td><span class="pending">Pending</span></td><td>980129</td></tr>
                <tr><td>#00154</td><td>Macbook Air</td><td>09 Jan 2023</td><td><span class="delivered">Delivered</span></td><td>POI1230</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="dashboard-main-right">
        <div class="dashboard-panel">
          <div class="panel-header">Top Product Sales</div>
          <div class="panel-chart">
            <!-- Placeholder para gráfico de pizza -->
            <div class="chart-placeholder">[Gráfico de pizza]</div>
          </div>
        </div>
        <div class="dashboard-panel">
          <div class="panel-header">Recent Sales</div>
          <div class="panel-table">
            <table>
              <thead>
                <tr><th>Date</th><th>Name</th><th>Amount</th></tr>
              </thead>
              <tbody>
                <tr><td>01 Feb</td><td>Robert</td><td>$80.12</td></tr>
                <tr><td>03 Feb</td><td>Smith</td><td>$76.53</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})

export class DashboardComponent {}

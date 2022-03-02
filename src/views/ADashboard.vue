<template>
  <div class="page-dashboard">
    <v-container>
      <v-row>
        <!-- mini statistic start -->
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card
            icon="mdi-server"
            :title="openData.server_count"
            sub-title="Assets"
            color="indigo"
          />
        </v-col>
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card
            icon="mdi-floppy"
            :title="openData.storage_sum"
            :sub-title="openData.storage_sum_unit + '  Disk'"
            color="red"
          />
        </v-col>
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card
            icon="mdi-account"
            :title="openData.os_users_sum"
            sub-title="OS Users"
            color="light-blue"
          />
        </v-col>
        <v-col :cols="12" :sm="6" :lg="3">
          <mini-statistic-card
            icon="fa-microchip"
            :title="openData.mem_sum"
            :sub-title="openData.mem_sum_unit + '  Memory'"
            color="purple"
          />
        </v-col>
        <!-- mini statistic  end -->
        <v-col :lg="4" :sm="12" :cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-toolbar-title>硬盘Top5 Bytes</v-toolbar-title>
              <v-btn slot="widget-header-action" icon>
                <v-icon class="text--secondary">mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-g2-bullet :data="chart.disk_bullet.data"                  v-if="dataOk"/>
            </v-card-text>
          </v-card>
        </v-col>
                <v-col :lg="4" :sm="12" :cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-toolbar-title>机柜分布</v-toolbar-title>
              <v-btn slot="widget-header-action" icon>
                <v-icon class="text--secondary">mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <e-chart
                :path-option="[
                  ['dataset.source', openData.dc_data_cabinets],
                  ['legend.bottom', '0'],
                  [
                    'color',
                    [
                      color.lightBlue.base,
                      color.indigo.base,
                      color.pink.base,
                      color.green.base,
                      color.cyan.base,
                      color.teal.base
                    ]
                  ],
                  ['xAxis.show', false],
                  ['yAxis.show', false],
                  ['series[0].type', 'pie'],
                  ['series[0].avoidLabelOverlap', true],
                  ['series[0].radius', ['50%', '70%']]
                ]"
                height="400px"
                width="100%"
                v-if="dataOk"
              />
            </v-card-text>
          </v-card>
        </v-col>
          <v-col :lg="4" :sm="12" :cols="12">
          <v-card tile>
            <v-toolbar flat>
              <v-toolbar-title>内存Top5 Bytes</v-toolbar-title>
              <v-btn slot="widget-header-action" icon>
                <v-icon class="text--secondary">mdi-refresh</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-g2-bullet :data="chart.mem_bullet.data"                  v-if="dataOk"/>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import API from '@/api'
import EChart from '@/components/chart/echart'
import Material from 'vuetify/es5/util/colors'
import MiniStatisticCard from '@/components/card/MiniStatisticCard'
import VG2Bullet from '@/components/chart/g2plot/bullet'
import request from '@/util/request2'
export default {
  name: 'PageDashboard',
  components: {
    EChart,
    MiniStatisticCard,
    VG2Bullet,
  },
  data: () => ({
    chart: {
              disk_bullet: {
          title: {
            visible: false,
            text: 'Bullet',
          },
          data: [
          ],
        },
                      mem_bullet: {
          title: {
            visible: false,
            text: 'Bullet',
          },
          data: [
          ],
        },
    },
    color: Material,
    dataOk: false,
    selectedTab: 'tab-1',
    openData: {
      // dc_data_cabinets: [
      //   {
      //     name: "酒仙桥",
      //     value: 1
      //   }
      // ]
    },
    linearTrending: [
      {
        subheading: 'Sales',
        headline: '2,55',
        caption: 'increase',
        percent: 15,
        icon: {
          label: 'mdi-trending-up',
          color: 'success'
        },
        linear: {
          value: 15,
          color: 'success'
        }
      },
      {
        subheading: 'Revenue',
        headline: '6,553',
        caption: 'increase',
        percent: 10,
        icon: {
          label: 'mdi-trending-down',
          color: 'error'
        },
        linear: {
          value: 15,
          color: 'error'
        }
      },
      {
        subheading: 'Orders',
        headline: '5,00',
        caption: 'increase',
        percent: 50,
        icon: {
          label: 'mdi-arrow-up',
          color: 'info'
        },
        linear: {
          value: 50,
          color: 'info'
        }
      }
    ],
    trending: [
      {
        subheading: 'Email',
        headline: '15+',
        caption: 'email opens',
        percent: 15,
        icon: {
          label: 'mdi-email-open',
          color: 'info'
        },
        linear: {
          value: 15,
          color: 'info'
        }
      },
      {
        subheading: 'Tasks',
        headline: '90%',
        caption: 'tasks completed.',
        percent: 90,
        icon: {
          label: 'mdi-view-list',
          color: 'primary'
        },
        linear: {
          value: 90,
          color: 'success'
        }
      },
      {
        subheading: 'Issues',
        headline: '100%',
        caption: 'issues fixed.',
        percent: 100,
        icon: {
          label: 'mdi-bug',
          color: 'primary'
        },
        linear: {
          value: 100,
          color: 'error'
        }
      }
    ]
  }),
  created() {
    request({
      url: `/openData`,
      method: 'get',
    }).then((resp) => {
      this.openData = resp.data
      this.chart.disk_bullet.data = resp.data.disk_avg_bullets
      this.chart.mem_bullet.data = resp.data.mem_avg_bullets
      this.dataOk = true
    })
  },
  computed: {
    activity() {
      return [
        {
          avatar:
            'https://s3.amazonaws.com/uifaces/faces/twitter/ludwiczakpawel/128.jpg',
          timeString: 'Just now',
          color: 'primary',
          text: 'Michael finished  one task just now.'
        },
        {
          avatar:
            'https://s3.amazonaws.com/uifaces/faces/twitter/suprb/128.jpg',
          timeString: '30 min ago',
          color: 'teal',
          text: 'Jim created a new  task.'
        },
        {
          avatar:
            'https://s3.amazonaws.com/uifaces/faces/twitter/suprb/128.jpg',
          timeString: '1 hour ago',
          color: 'indigo',
          text: 'Li completed the PSD to html convert.'
        },
        {
          avatar:
            'https://s3.amazonaws.com/uifaces/faces/twitter/suprb/128.jpg',
          timeString: '3 hour ago',
          color: 'pink',
          text: 'Michael upload a new pic.'
        },
        {
          avatar:
            'https://s3.amazonaws.com/uifaces/faces/twitter/suprb/128.jpg',
          timeString: '10 min ago',
          color: 'cyan',
          text: 'Li assigned a a task to Michael'
        }
      ]
    },
    siteTrafficData() {
      return API.getMonthVisit
    },
    locationData() {
      return API.getLocation
    },
    dcData() {

      return this.openData.dc_data_cabinets
    }
  }
}
</script>

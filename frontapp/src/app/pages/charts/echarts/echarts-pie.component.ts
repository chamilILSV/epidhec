import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'ngx-echarts-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsPieComponent implements AfterViewInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  stores: any = [];
  storesData: any;

  constructor(private theme: NbThemeService, private httpClient: HttpClient) {
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;
      this.initStores(colors, echarts);
    });
  }

  initStores(colors: any, echarts: any) {

    this.getStores().then(data => {
      this.storesData = data;
      console.log("data = ", data);
      this.storesData.forEach(element => {
        this.stores.push(element.name);
      });
      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.stores,
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Magasins',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: this.storesData,
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  getStores() {
    return this.httpClient.get("http://localhost:8000/getStores/").toPromise()
    .then(data => { return data });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }
}

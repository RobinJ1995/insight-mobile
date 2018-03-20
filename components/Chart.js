import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ChartView from 'react-native-highcharts';
import { global } from 'core-js/library/web/timers';

export default class Chart extends Component {
  getTimeserie(dataItem) {
    const {
      leql: {
        statement: name,
      },
      statistics: {
        timeseries: {
          global_timeseries,
        },
        from,
        to,
      }
    } = dataItem;

    const n = global_timeseries.length;
    const data = global_timeseries.map(({ count }, i) => [
      from + ((to - from) / n) * i,
      count
    ]);

    return {
      data,
      name
    };
    ({
      data: item.statistics.timeseries.global_timeseries.map(({ count }, i) => [this.getConfigTimestamp(item, i), count]),
      name: item.leql.statement,
    })
  }

  createConfig() {
    const {
      data,
    } = this.props;

    return {
      "chart": {
        "spacingBottom": 15,
        "spacingLeft": 15,
        "spacingRight": 15,
        "spacingTop": 15,
        "type": "spline"
      },
      "credits": {
        "enabled": false
      },
      "legend": {
        "itemStyle": {
          "width": "150px",
          "textOverflow": "ellipsis",
          "overflow": "hidden"
        }
      },
      "plotOptions": {
        "series": {
          "animation": true,
          "getExtremesFromAll": false
        }
      },
      "subtitle": {
        "text": null
      },
      "title": {
        "text": null
      },
      "tooltip": {
        "backgroundColor": "#fff"
      },
      "xAxis": {
        "title": {
          "text": null
        },
        "dateTimeLabelFormats": {
          "minute": "%b %e %H:%M",
          "hour": "%b %e %H:%M",
          "day": "%b %e %H:%M",
          "week": "%b %e %H:%M",
          "month": "%b %e %H:%M"
        },
        "type": "datetime"
      },
      "yAxis": {
        "title": {
          "text": null
        },
        "min": 0,
        "minRange": 1
      },
      exporting: {
        enabled: false
      },
      "series": data.map(item => this.getTimeserie(item)),
    };

    // return {
    //   chart: {
    //     type: 'column',
    //   },
    //   title: {
    //     text: null,
    //   },
    //   xAxis: {
    //     type: 'category',
    //     labels: {
    //       autoRotation: [-10, -20, -30, -40, -50, -60, -70, -80, -90],
    //     },
    //   },
    //   yAxis: {
    //     min: 0,
    //     title: {
    //       text: null,
    //     },
    //   },
    //   series: [{
    //     showInLegend: false,
    //     name: calculateFunction,
    //     data: groupData,
    //   }],
    //   credits: {
    //     enabled: false,
    //   },
    //   navigator: {
    //     enabled: true,
    //     maskInside: false,
    //     maskFill: 'rgba(255, 255, 255, 0.5)',
    //     handles: {
    //       backgroundColor: '#7cb5ec',
    //       borderColor: '#e6e7e7',
    //     },
    //     xAxis: {
    //       labels: {
    //         enabled: false,
    //       },
    //     },
    //     series: {
    //       type: 'area',
    //       fillColor: '#7cb5ec',
    //       color: '#7cb5ec',
    //       lineWidth: 1,
    //     },
    //   },
    // };
  }

  render() {
    const Highcharts = 'Highcharts';
    const highchartsConfig = this.createConfig();
    const highchartsOptions = {
      global: {
        useUTC: false,
      },
    };
    console.log('high charts config', highchartsConfig);
    return (
      <ChartView
        style={{ height: 300, width: '100%', backgroundColor: 'white' }}
        config={highchartsConfig}
        options={highchartsOptions}
      ></ChartView>
    );
  }
}

const styles = StyleSheet.create({
});

// const DEMO_CONFIG = {
//   chart: {
//     type: 'spline',
//     animation: Highcharts.svg, // don't animate in old IE
//     marginRight: 10,
//     backgroundColor: 'black',
//     events: {
//       load: function () {

//         // set up the updating of the chart each second
//         var series = this.series[0];
//         setInterval(function () {
//           var x = (new Date()).getTime(), // current time
//             y = Math.random();
//           series.addPoint([x, y], true, true);
//         }, 1000);
//       }
//     }
//   },
//   title: {
//     text: 'Live random data'
//   },
//   xAxis: {
//     type: 'datetime',
//     tickPixelInterval: 150
//   },
//   yAxis: {
//     title: {
//       text: 'Value'
//     },
//     plotLines: [{
//       value: 0,
//       width: 1,
//       color: '#808080'
//     }]
//   },
//   tooltip: {
//     formatter: function () {
//       return '<b>' + this.series.name + '</b><br/>' +
//         Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
//         Highcharts.numberFormat(this.y, 2);
//     }
//   },
//   legend: {
//     enabled: false
//   },
//   exporting: {
//     enabled: false
//   },
//   series: [{
//     name: 'Random data',
//     data: (function () {
//       // generate an array of random data
//       var data = [],
//         time = (new Date()).getTime(),
//         i;

//       for (i = -19; i <= 0; i += 1) {
//         data.push({
//           x: time + i * 1000,
//           y: Math.random()
//         });
//       }
//       return data;
//     }())
//   }]
// };
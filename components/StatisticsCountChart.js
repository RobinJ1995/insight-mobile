import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import ChartView from 'react-native-highcharts';
import { global } from 'core-js/library/web/timers';

export default class StatisticsCountChart extends Component {
  createConfig() {
    const {
      groups,
      query,
    } = this.props;

  return {
      chart: {
        type: 'column'
      },
      credits: {
        enabled: false,
      },
      title: {
        text: query || '',
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      },
      exporting: {
        enabled: false
      },
      yAxis: {
        min: 0,
        title: {
          text: null,
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'COUNT',
        data: groups.map(
          group => Object.keys(group).map(value => [value, group[value].count])
        ).reduce((arr, cur) => arr.concat(cur), []),
        dataLabels: {
          enabled: true,
          rotation: -90,
          color: '#FFFFFF',
          align: 'right',
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif'
          }
        }
      }]
    };
  };

  render() {
    const Highcharts = 'Highcharts';
    const highchartsConfig = this.createConfig();
    const highchartsOptions = {
      global: {
        useUTC: false,
      },
    };
    console.log('high charts config (statistics count)', highchartsConfig);
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
import React, { useState, useEffect } from 'react';

import './applied-job-offers.scss';

import { Table, Slider, Button } from 'antd';


const AppliedJobOffers = ({ limit, loading }) => {

  const dataSource = [
    {
      key: '1',
      name: 'Diseñador industrial',
      age: 32,
      state: 0,
      date: '21-05-2019'
      // render: text => showSlider(),

    },
    {
      key: '2',
      name: 'Auxiliar en diseño industrial',
      age: 42,
      state: 50,
      date: '01-11-2019'
    },
    {
      key: '3',
      name: 'Diseñador industrial junior',
      age: 42,
      state: 100,
      date: '21-05-2019'
    },
    {
      key: '4',
      name: 'Diseñador industrial junior',
      age: 42,
      state: 50,
      date: '21-05-2019'
    },
    {
      key: '5',
      name: 'Diseñador industrial junior',
      age: 42,
      state: 0,
      date: '21-05-2019'
    },
    {
      key: '6',
      name: 'Diseñador industrial junior',
      age: 42,
      state: 100,
      date: '21-05-2019'
    },
    {
      key: '7',
      name: 'Diseñador industrial junior',
      age: 42,
      state: 50,
      date: '21-05-2019'
    },
  ];


  const [datasourceState, setDatasourceState] = useState(dataSource);

  const showSlider = (param, record) => {
    const slider = <Slider marks={marks}
      defaultValue={param}
      step={null}
      tooltipVisible={false}
      disabled={false} />

    return slider
  }



  const columns = [
    {
      title: 'Ofertas a las que he aplicado',
      expandedRowRender: text => <span>Hola mundo</span>,
      // render: text => <a href="javascript:;">Hola mundo</a>,
      dataIndex: 'name',
      key: 'name',
      width: 270,
    },
    {
      title: 'Fecha de aplicación',
      dataIndex: 'date',
      key: 'date',
      align: 'center'
    },
    {
      title: text =>
        <div className="label-state">
          <span>HV vista</span>
          <span>En proceso</span>
          <span>Finalista</span>
        </div>,
      className: 'col-state',
      dataIndex: 'state',
      key: 'state',
      width: 300,
      render: (text, record) => showSlider(text, record),
    },
    {
      title: '',
      dataIndex: 'state',
      key: 'states',
      render: () => <Button shape="circle" icon="delete" />,
      align: 'right'
    },
  ];

  const marks = {
    0: '',
    50: '',
    100: ''
  };

  useEffect(() => {
    if (limit) {
      setDatasourceState(dataSource.splice(0, 3));
    }

  }, []);

  return (
    <Table dataSource={datasourceState}
      columns={columns}
      pagination={false}
      bordered={false}
      loading={loading}
    />
  );
}

export default AppliedJobOffers

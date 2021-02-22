import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import BasicDemo from './demo/Basic';
import FootersDemo from './demo/Footers';
import SortingDemo from './demo/Sorting';
import FilteringDemo from './demo/Filtering'
import GroupingDemo from './demo/Grouping';
import PaginationDemo from './demo/Pagination';
import RowSelectionDemo from './demo/RowSelection';
import ExpandingDemo from './demo/Expanding'
import LazySubComponentDemo from './demo/LazySubComponent'
import EditableDataDemo from './demo/EditableData'
import ColumnHidingDemo from './demo/ColumnHiding'
import FullWidthColumnResizingDemo from './demo/FullWidthColumnResizing'
import DataDrivenDemo from './demo/DataDriven'
import VirtualizedRowsDemo from './demo/VirtualizedRows'


import reportWebVitals from './reportWebVitals';
ReactDOM.render(
  <>

    <ul>
      <li><a href="#basic">基础</a></li>
      <li><a href="#footers">页脚</a></li>
      <li><a href="#sorting">排序</a></li>
      <li><a href="#filtering">过滤</a></li>
      <li><a href="#grouping">分组</a></li>
      <li><a href="#pagination">分页</a></li>
      <li><a href="#rowSelection">行勾选</a></li>
      <li><a href="#expanding">行展开子</a></li>
      <li><a href="#lazySubComponent">懒加载子行组件</a></li>
      <li><a href="#editableData">可编辑表格</a></li>
      <li><a href="#columnHiding">列可隐藏</a></li>
      <li><a href="#fullWidthColumnResizing">列可调整</a></li>
      <li><a href="#dataDriven">自定义 行事件、列事件、行样式、格子样式</a></li>
      <li><a href="#virtualizedRows">虚拟行</a></li>
    </ul>
    <BasicDemo />
    <FootersDemo />
    <SortingDemo />
    <FilteringDemo />
    <GroupingDemo />
    <PaginationDemo />
    <RowSelectionDemo />
    <ExpandingDemo />
    <LazySubComponentDemo />
    <EditableDataDemo />
    <ColumnHidingDemo />
    <FullWidthColumnResizingDemo />
    <DataDrivenDemo />
    <VirtualizedRowsDemo />


  </>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TabbedContainer.css';

export class TabbedContainer extends Component {
  constructor(props) {
    super(props);
    const { tabs, selectedTabId } = props;
    let currentTabIndex = 0;
    if (selectedTabId) {
      tabs.forEach((tab, index) => {
        if (tab.id === selectedTabId) {
          currentTabIndex = index;
        }
      });
    }
    this.state = {
      currentTabIndex,
      currentTabChild: tabs[currentTabIndex].child,
    };
    this.onTabClick = this.onTabClick.bind(this);

    // Only replace state if coming from index, otherwise Gatsby appends the path for us.
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      window.history.pushState({}, '', `/${selectedTabId}`);
    }
  }

  onTabClick(event, index) {
    const { tabs } = this.props;
    const { id, child } = tabs[index];
    this.setState({
      currentTabIndex: index,
      currentTabChild: child,
    });
    window.history.pushState({}, '', `/${id}`);
  }

  render() {
    const { tabs } = this.props;
    const { currentTabIndex, currentTabChild } = this.state;

    return (
      <>
        <ul className="tabbed-container">
          {
            tabs.map((tab, index) => {
              const selectedClassName = index === currentTabIndex ? 'tabbed-container--selected' : '';
              return (
                <li className={selectedClassName} key={tab.id}>
                  <button className="tabbed-container__tab" type="button" onClick={(event) => this.onTabClick(event, index)}>
                    {tab.display}
                  </button>
                </li>
              );
            })
          }
        </ul>
        <div>
          {currentTabChild}
        </div>
      </>
    );
  }
}

TabbedContainer.propTypes = {
  selectedTabId: PropTypes.string.isRequired,
  tabs: PropTypes.arrayOf(PropTypes.any).isRequired,
};

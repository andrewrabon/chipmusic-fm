import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TabbedContainer.css';

export class TabbedContainer extends Component {
  constructor(props) {
    super(props);
    const { tabs } = props;
    this.state = {
      currentTabIndex: 0,
      currentTabChild: tabs[0].child,
    };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(event, index) {
    const { tabs } = this.props;
    const { child } = tabs[index];
    this.setState({
      currentTabIndex: index,
      currentTabChild: child,
    });
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
  tabs: PropTypes.arrayOf(PropTypes.any).isRequired,
};

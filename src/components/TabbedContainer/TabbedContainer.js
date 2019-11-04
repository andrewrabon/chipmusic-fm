import React, { Component } from 'react';
import './TabbedContainer.css';

class TabbedContainer extends Component {
  constructor(props) {
    super(props);
    const { tabs } = props;
    this.state = {
      currentTabId: 0,
      currentTabChild: tabs[0].child,
    };
    this.onTabClick = this.onTabClick.bind(this);
  }

  onTabClick(event) {
    const { id } = event.currentTarget.dataset;
    const { tabs } = this.props;
    const { child } = tabs[index];
    this.setState({
      currentTabId: id,
      currentTabChid: child,
    });
  }

  render() {
    const { tabs } = this.props;
    const { currentTabId, currentTabChild } = this.state;

    return (
      <>
        <ul className="tabbed-container">
          {
            tabs.map((tab, index) => {
              const selectedClassName = tab.id === currentTabId ? 'tabbed-container--selected' : '';
              return (
                <li className={selectedClassName}>
                  <button type="button" onClick={this.onTabClick} data-index={index}>
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

export { TabbedContainer };

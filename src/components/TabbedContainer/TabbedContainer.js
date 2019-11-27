import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './TabbedContainer.css';

export class TabbedContainer extends Component {
  constructor(props) {
    super(props);
    const { children, selectedTabId } = props;
    let currentTabIndex = 0;
    if (selectedTabId) {
      children.forEach((tab, index) => {
        if (tab.props.id === selectedTabId) {
          currentTabIndex = index;
        }
      });
    }
    this.state = {
      currentTabIndex,
      currentTabChild: children[currentTabIndex],
    };
    this.onTabClick = this.onTabClick.bind(this);

    // Only replace state if coming from index, otherwise Gatsby appends the path for us.
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      window.history.pushState({}, '', `/${selectedTabId}`);
    }
  }

  onTabClick(event, index) {
    // We do this instead of using a button so the SSR renders each tab as a link for non-JS
    // users. We also do this instead of using Gatsby's <Link> so the tabs can be dynamic for
    // everyone else.
    event.preventDefault();
    event.stopPropagation();
    const { children } = this.props;
    const child = children[index];
    this.setState({
      currentTabIndex: index,
      currentTabChild: child,
    });
    window.history.pushState({}, '', `/${child.props.id}`);
  }

  render() {
    const { children } = this.props;
    const { currentTabIndex, currentTabChild } = this.state;

    return (
      <div className="tabbed-container">
        <ul className="tabbed-container__list">
          {
            children.map((tab, index) => {
              const selectedClassName = index === currentTabIndex ? 'tabbed-container__entry--selected' : '';
              return (
                <li className={selectedClassName} key={tab.props.id}>
                  <a href={`/${tab.props.id}`} className="tabbed-container__tab" onClick={(event) => this.onTabClick(event, index)}>
                    <span className="tabbed-container__desktop">
                      {tab.props.display}
                    </span>
                    <span className="tabbed-container__mobile material-icons">
                      {tab.props.glyph}
                    </span>
                  </a>
                </li>
              );
            })
          }
        </ul>
        <div className="tabbed-container__child">
          {currentTabChild}
        </div>
      </div>
    );
  }
}

TabbedContainer.propTypes = {
  children: PropTypes.arrayOf(PropTypes.any).isRequired,
  selectedTabId: PropTypes.string.isRequired,
};

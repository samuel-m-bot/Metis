import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './breadcrumb.css'

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  return (
    <nav aria-label="breadcrumb" id='breadcrumb_metis'>
      <ol className="breadcrumb">
        <li className="breadcrumb-item"><Link to="/home">Home</Link></li>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          return (
            <li key={name} className={`breadcrumb-item ${isLast ? 'active' : ''}`}>
              {isLast ? name : <Link to={routeTo}>{name}</Link>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

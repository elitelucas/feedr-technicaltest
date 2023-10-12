import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { join } from '../server/items';

export default () => {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [search, setSearch] = useState('');
  const [dietaryCounts, setDietaryCounts] = useState([]);

  //fetch items from server
  useEffect(() => {
    fetchItems();
  }, [search]);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/items?search=' + search);
      setItems(response.data.items);
    } catch (error) {
      console.log('Error fetching items:', error);
    }
  };

  //count the dietary type
  useEffect(() => {
    const dietaryCounts = selectedItems.reduce((counts, item) => {
      item.dietaries.forEach(dietary => {
        counts[dietary] = (counts[dietary] || 0) + 1;
      });
      return counts;
    }, {});
    setDietaryCounts(Object.entries(dietaryCounts))
  }, [selectedItems]);

  //handle click of X button
  const removeSelectedItem = (index) => {
    const updatedList = selectedItems.filter((item, i) => i !== index);
    setSelectedItems(updatedList);
  };

  return (
    <div className="wrapper">
      <div className="menu-summary">
        <div className="container">
          <div className="row">
            <div className="col-6 menu-summary-left">
              <span>{selectedItems.length} items</span>
            </div>
            <div className="col-6 menu-summary-right">
              {
                dietaryCounts.map(([key, value]) =>
                  <>
                    {value}x <span className="dietary">{key}</span>
                  </>)}
            </div>
          </div>
        </div>
      </div>
      <div className="container menu-builder">
        <div className="row">
          <div className="col-4">
            <div className="filters">
              <input className="form-control" placeholder="Name" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <ul className="item-picker">
              {
                items.map((item, index) => (
                  <li className="item" style={{ cursor: 'pointer' }} onClick={() => setSelectedItems([...selectedItems, item])}>
                    <h2>{item.name}</h2>
                    <p>
                      {
                        item.dietaries.map((dietary) => <span className="dietary">{dietary}</span>)
                      }
                    </p>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className="col-8">
            <h2>Menu preview</h2>
            <ul className="menu-preview">
              {
                selectedItems.map((item, index) =>
                  <li className="item">
                    <h2>{item.name}</h2>
                    <p>
                      {
                        item.dietaries.map((dietary) => <span className="dietary">{dietary}</span>)
                      }
                    </p>
                    <button className="remove-item" onClick={() => removeSelectedItem(index)}>x</button>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </div >);
};

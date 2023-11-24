import React, { useState } from 'react';
import Modal from './Modal';
import './ItemList.css';

interface Item {
  title: string;
  imageFile?: string;
  videoFile?: string;
  _3dFile?: string;
}

interface ItemsListProps {
  items: Item[];
}

const ItemList: React.FC<ItemsListProps> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleItemClick = (item: Item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getHighlightedText = (text: string, highlight: string) => {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => (
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={index} style={{ color: 'red' }}>
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          )
        ))}
      </span>
    );
  };

  return (
    <div>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {filteredItems.length > 0 ? (
        <div className='item-list-container'>
          {filteredItems.map((item, index) => (
            <div className='item-card' key={index} onClick={() => handleItemClick(item)}>
              {item.imageFile && (
                <img
                  src={'/src/assets' + item.imageFile}
                  alt={item.title}
                  onError={(event) => {
                    const target = event.target as HTMLImageElement;
                    if (target) {
                      target.src = '/src/assets/images/fallback.jpg'; 
                    }
                  }}
                />
              )}
              {item.videoFile && (
                <video
                  style={{ width: '-webkit-fill-available' }}
                  onMouseOver={(event) => {
                    const target = event.target as HTMLVideoElement;
                    if (target) {
                      target.play();
                    }
                  }}
                  onMouseOut={(event) => {
                    const target = event.target as HTMLVideoElement;
                    if (target) {
                      target.pause();
                    }
                  }}
                  muted={true}
                  src={'/src/assets' + item.videoFile}
                />
              )}
              <h3>{getHighlightedText(item.title, searchQuery)}</h3>
            </div>
          ))}
          {selectedItem && (
            <Modal item={selectedItem} onClose={handleCloseModal} />
          )}
        </div>) : (
        <p className="not-found">Not found</p>
      )}
    </div>
  );
};

export default ItemList;

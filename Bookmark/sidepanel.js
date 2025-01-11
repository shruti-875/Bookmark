document.addEventListener('DOMContentLoaded', () => {
  const bookmarkContainer = document.getElementById('bookmarkContainer');
  const bmTitleInput = document.getElementById('bmTitle');
  const bmLinkInput = document.getElementById('bmLink');
  const backdrop = document.getElementById('backdrop');
  const tabsContainer = document.getElementById('tabsContainer');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  let currentCategory = 'Personal';

  const loadBookmarks = (searchTerm = '') => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    bookmarkContainer.innerHTML = '';
    bookmarks
      .filter(bookmark => bookmark.category === currentCategory && bookmark.bmTitle.toLowerCase().includes(searchTerm.toLowerCase()))
      .forEach(bookmark => {
        addBookmarkToDOM(bookmark);
      });
  };

  const saveBookmarks = (bookmarks) => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  const getBookmarks = () => {
    return JSON.parse(localStorage.getItem('bookmarks')) || [];
  };

  const addBookmarkToDOM = (bookmark) => {
    const li = document.createElement('li');
    li.className = 'bm-item';
    li.innerHTML = `
      <a href="${bookmark.bmLink}" target="_blank" rel="noopener noreferrer">
        <img src="https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${bookmark.bmLink}&size=24" alt="" class="image">
        <span class="bm-title">${bookmark.bmTitle}</span>
      </a>
      <div class="btn-group">
        <button class="btn-share" data-link="${bookmark.bmLink}" data-title="${bookmark.bmTitle}"><img src="share.png" class="share-emoji"></button>
        <button class="btn-delete" data-id="${bookmark.id}"><img src="delete.png" class="share-emoji"></button>
      </div>
    `;
    bookmarkContainer.appendChild(li);

    const deleteButton = li.querySelector('.btn-delete');
    deleteButton.addEventListener('click', () => deleteBookmark(bookmark.id));

    const shareButton = li.querySelector('.btn-share');
  shareButton.addEventListener('click', (e) => shareBookmark(e.target.dataset.link, e.target.dataset.title));
  };

  const shareBookmark = (link, title) => {
    const shareData = {
      title: title,
      text: 'Check out this bookmark!',
      url: link
    };
  
    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`;
      const discordShareUrl = `https://discordapp.com/channels/@me?url=${encodeURIComponent(link)}`;
      const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(link)}`;
  
      const shareDialog = `
        <div class="share-dialog">
          <a href="${facebookShareUrl}" target="_blank">Share on Facebook</a>
          <a href="${discordShareUrl}" target="_blank">Share on Discord</a>
          <a href="${twitterShareUrl}" target="_blank">Share on Twitter</a>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', shareDialog);
    }
  };
  
  const addBookmark = (bookmark) => {
    const bookmarks = getBookmarks();
    bookmarks.push(bookmark);
    saveBookmarks(bookmarks);
    if (bookmark.category === currentCategory) {
      addBookmarkToDOM(bookmark);
    }
  };

  const deleteBookmark = (id) => {
    let bookmarks = getBookmarks();
    bookmarks = bookmarks.filter(bookmark => bookmark.id !== id);
    saveBookmarks(bookmarks);
    loadBookmarks();
  };

  const openForm = () => {
    document.getElementById('bookmarkFormSection').style.display = 'block';
    backdrop.style.display = 'block';
  };

  const closeForm = () => {
    document.getElementById('bookmarkFormSection').style.display = 'none';
    backdrop.style.display = 'none';
  };

  const switchCategory = (category) => {
    currentCategory = category;
    loadBookmarks();
  };

  document.getElementById('bookmarkForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const bmTitle = bmTitleInput.value;
    const bmLink = bmLinkInput.value;
    const bookmark = { id: Date.now().toString(), bmTitle, bmLink, category: currentCategory };
    addBookmark(bookmark);
    bmTitleInput.value = '';
    bmLinkInput.value = '';
    closeForm();
  });

  document.getElementById('openFormButton').addEventListener('click', openForm);
  document.getElementById('closeFormButton').addEventListener('click', closeForm);
  backdrop.addEventListener('click', closeForm);

  searchButton.addEventListener('click', () => {
    const searchTerm = searchInput.value;
    loadBookmarks(searchTerm);
  });

  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      const searchTerm = searchInput.value;
      loadBookmarks(searchTerm);
    }
  });

  const createTabs = (categories) => {
    tabsContainer.innerHTML = '';
    categories.forEach(category => {
      const tab = document.createElement('button');
      tab.className = 'bms-tab';
      tab.textContent = category;
      tab.dataset.category = category;
      tab.addEventListener('click', () => {
        switchCategory(category);
        updateActiveTab(tab);
      });
      tabsContainer.appendChild(tab);
    });
    const initialTab = tabsContainer.querySelector('.bms-tab');
    if (initialTab) {
      initialTab.classList.add('active');
    }
  };

  const updateActiveTab = (selectedTab) => {
    const tabs = tabsContainer.querySelectorAll('.bms-tab');
    tabs.forEach(tab => {
      if (tab === selectedTab) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  };

  const categories = ['Personal', 'Work', 'Research'];
  createTabs(categories);

  loadBookmarks();
});

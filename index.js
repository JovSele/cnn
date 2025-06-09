let breakingImg = document.querySelector('#breakingImg')
let breakingNews_title = document.querySelector('#breakingNews .title')
let breakingNews_desc = document.querySelector('#breakingNews .description')
let topNews = document.querySelector('.topNews')
let sportsNews = document.querySelector('#sportsNews .newsBox')
let businessNews = document.querySelector('#businessNews .newsBox')
let techNews = document.querySelector('#techNews .newsBox')

let header = document.querySelector('.header')
let toggleMenu = document.querySelector('.bar')
let menu = document.querySelector('nav ul')

const toggle = () => {
    toggleMenu.classList.toggle('active')
    menu.classList.toggle('activeMenu')
}

toggleMenu.addEventListener('click', toggle)

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('sticky')
    } else {
        header.classList.remove('sticky')
    }
})

// FETCH RSS via rss2json
const fetchRSSFeed = async (url) => {
    const rss2json = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    const res = await fetch(rss2json)
    const data = await res.json()
    return data.items
}

// BREAKING NEWS (NYTimes)
fetchRSSFeed("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml").then(data => {
    const firstWithImage = data.find(item => item.enclosure?.link || item.thumbnail)
    if (!firstWithImage) return

    let imageUrl = firstWithImage.enclosure?.link || firstWithImage.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'
    breakingImg.innerHTML = `<img src="${imageUrl}" alt="breaking">`
    breakingNews_title.innerHTML = `<a href="${firstWithImage.link}" target="_blank"><h2>${firstWithImage.title}</h2></a>`
    breakingNews_desc.innerHTML = firstWithImage.description
})

// TOP NEWS (NYTimes)
fetchRSSFeed("https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml").then(data => {
    let html = ''
    const itemsWithImages = data.filter(item => item.enclosure?.link || item.thumbnail).slice(0, 10)

    itemsWithImages.forEach(item => {
        let title = item.title.length < 100 ? item.title : item.title.slice(0, 100) + "..."
        let imageUrl = item.enclosure?.link || item.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'
        html += `<div class="news">
                    <div class="img">
                        <img src="${imageUrl}" alt="image">
                    </div>
                    <div class="text">
                        <div class="title">
                        <a href="${item.link}" target="_blank"><p>${title}</p></a>
                        </div>
                    </div>
                </div>`
    })
    topNews.innerHTML = html
})

// UNIVERZÁLNA FUNKCIA PRE KATEGÓRIE – len s obrázkami
const addNewsSection = (data, container) => {
    let html = ''
    const itemsWithImages = data.filter(item => item.enclosure?.link || item.thumbnail).slice(0, 5)

    itemsWithImages.forEach(item => {
        let title = item.title.length < 100 ? item.title : item.title.slice(0, 100) + "..."
        let imageUrl = item.enclosure?.link || item.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image'
        html += `<div class="newsCard">
                    <div class="img">
                        <img src="${imageUrl}" alt="image">
                    </div>
                    <div class="text">
                        <div class="title">
                        <a href="${item.link}" target="_blank"><p>${title}</p></a>
                        </div>
                    </div>
                </div>`
    })
    container.innerHTML = html
}

// SPORTS (Sky Sports)
fetchRSSFeed("https://www.skysports.com/rss/12040").then(data => addNewsSection(data, sportsNews))

// BUSINESS (NYTimes)
fetchRSSFeed("https://rss.nytimes.com/services/xml/rss/nyt/Business.xml").then(data => addNewsSection(data, businessNews))

// TECHNOLOGY (NYTimes)
fetchRSSFeed("https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml").then(data => addNewsSection(data, techNews))

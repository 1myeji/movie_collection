;(async () => {
  // 초기화 코드들
  const moviesEl = document.querySelector('.movies')
  const movieEl = document.querySelector('.movie')
  const inputEl = document.querySelector('.movietitle')
  const searchBtnEl = document.querySelector('.searchbtn')
  const countEl = document.querySelector('.moviecount')
  const selectEl = document.querySelector('.form-select')
  const loaderEl = document.querySelector('.loader')
  const contentEl = document.querySelector('.inner__content')
  const lastSection = document.querySelector('.lastsection')
  const morebtnEl = document.querySelector('.morebtn')
  let page
  let year
  let title
  let id

  // 새로고침시 로딩바
  window.onbeforeunload = function () {
    loaderEl.classList.remove('hide')
  }
  window.addEventListener('load', () => {
    loaderEl.classList.add('hide')
  })

  let num
  morebtnEl.addEventListener('click', async () => {
    num++
    page++
    const movies = await getMovies(title, page, year, id)
    if(movies == undefined) {
      morebtnEl.classList.add('hide') 
      morebtnEl.classList.add('hide')
    } else {
      renderMovies(movies)
      countMovies()
    }
    morebtnEl.classList.add('hide')
  })

  // SEARCH 버튼 클릭 시
  searchBtnEl.addEventListener('click', async () => {
    page = 1
    findMovies()
  }) 

  // ENTER 누르면
  inputEl.addEventListener('keypress', async (e) => {
    page = 1
    if(e.key === 'Enter'){
      findMovies()
    }
  })
  
  async function findMovies () {
    num = 1
    if(moviesEl.innerHTML !== '') {
      moviesEl.innerHTML = ''
    }      
    year = selectEl.value
    title = inputEl.value
    if(inputEl.value === '') {
      alert('제목을 입력하세요!')
      contentEl.classList.remove('hide')
      morebtnEl.classList.add('hide')
    } else {
      loaderEl.classList.remove('hide')
      const movies = await getMovies(title, page, year, id)
      contentEl.classList.add('hide')
      if(movies !== undefined) {
        renderMovies(movies)
        loaderEl.classList.add('hide') 
        morebtnEl.classList.remove('hide')
      } else {
        loaderEl.classList.add('hide') 
        morebtnEl.classList.add('hide')
      }
    }
    countMovies()
  }

  async function getMovies(title, page, year, id) {
    const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&s=${title}&page=${page}&y=${year}&i=${id}`)
    const { Search: movies } = await res.json()
    console.log(movies)
    return movies
  }

  function renderMovies (movies) {
    for(const movie of movies) {
      const el = document.createElement('div')
      el.classList.add('movie')
      const imgEl = document.createElement('img')
      imgEl.src = movie.Poster
      // 대체 이미지
      imgEl.setAttribute('onerror', "this.src='https://st4.depositphotos.com/14953852/24787/v/600/depositphotos_247872612-stock-illustration-no-image-available-icon-vector.jpg'")
      const divEl = document.createElement('div')
      divEl.classList.add('info')
      const yearEl = document.createElement('h2')
      yearEl.textContent = movie.Year
      const h1El = document.createElement('h1')
      h1El.textContent = textLengthOverCut(movie.Title)
      divEl.append(yearEl, h1El)
      el.append(imgEl, divEl)
      moviesEl.append(el)
    }
    lastSection.classList.remove('hide')
  }

  async function countMovies () {
    if(countEl.value == 20) {
      page++
      const movies = await getMovies(title, page, year, id)
      movies == undefined? morebtnEl.classList.add('hide') : renderMovies(movies)
    }
    if(countEl.value == 30) {
      page++
      let movies = await getMovies(title, page, year, id)
      movies == undefined? morebtnEl.classList.add('hide') : renderMovies(movies)
      page++
      movies = await getMovies(title, page, year, id)
      movies == undefined? morebtnEl.classList.add('hide') : renderMovies(movies)
    }
  }

  // 제목 길면 ... 처리
  function textLengthOverCut(txt, len = 15, lastTxt = "...") {
    if (txt.length > len) {
        txt = txt.substr(0, len) + lastTxt;
    }
    return txt;
  }

  // 무한스크롤
  const io = new IntersectionObserver ((entries) => {
    if(entries[0].isIntersecting && num == 2) {
      setTimeout(async () => {
        page += 1
        loaderEl.classList.remove('hide')
        if(inputEl.value === '' ) {
          alert('제목을 입력하세요!')
          loaderEl.classList.add('hide') 
        } else {
          const movies = await getMovies(title, page, year, id)
          if(movies !== undefined) {
            renderMovies(movies)
            loaderEl.classList.add('hide') 
          } else {
            loaderEl.classList.add('hide') 
          }
        }
        countMovies()
      }, 200)
    }
  })
  io.observe(lastSection)
})()
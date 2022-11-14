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
  let lastSection = document.querySelector('.lastsection')
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
    contentEl.classList.add('hide')
    if(moviesEl.innerHTML !== '') {
      moviesEl.innerHTML = ''
    }      
    year = selectEl.value
    title = inputEl.value
    if(inputEl.value === '') {
      alert('제목을 입력하세요!')
    } else {
      loaderEl.classList.remove('hide')
      const movies = await getMovies(title, page, year, id)
      if(movies !== undefined) {
        renderMovies(movies)
        loaderEl.classList.add('hide') 
      } else {
        loaderEl.classList.add('hide') 
        alert('결과없음')
      }
    }
    if(countEl.value == 20) {
      const movies = await getMovies(title, page + 1, year, id)
      renderMovies(movies)
    }
    if(countEl.value == 30) {
      let movies = await getMovies(title, page + 1, year, id)
      renderMovies(movies)
      movies = await getMovies(title, page + 2, year, id)
      renderMovies(movies)
    }
  }

  async function getMovies(title, page, year, id) {
    lastSection.classList.add('hide')
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

  // 제목 길면 ... 처리
  function textLengthOverCut(txt, len = 15, lastTxt = "...") {
    if (txt.length > len) {
        txt = txt.substr(0, len) + lastTxt;
    }
    return txt;
  }

  // 무한스크롤
  const io = new IntersectionObserver ((entries) => {
    if(entries[0].isIntersecting) {
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
        if(countEl.value == 20) {
          const movies = await getMovies(title, page + 1, year, id)
          renderMovies(movies)
        }
        if(countEl.value == 30) {
          let movies = await getMovies(title, page + 1, year, id)
          renderMovies(movies)
          movies = await getMovies(title, page + 2, year, id)
          renderMovies(movies)
        }
      }, 200)
    }
  })
  io.observe(lastSection)
})()
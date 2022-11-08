;(async () => {
  // 초기화 코드들~
    const moviesEl = document.querySelector('.movies')
    const movieEl = document.querySelector('.movie')
    const moreBtnEl = document.querySelector('.morebtn')
    const inputEl = document.querySelector('.movietitle')
    const searchBtnEl = document.querySelector('.searchbtn')
    const selectEl = document.querySelector('.form-select')
    const loaderEl = document.querySelector('.loader')
    const html = document.querySelector('html')
    let page = 1
    let year
    let title

    window.onbeforeunload = function () {
      loaderEl.classList.remove('hide')
    }
    window.addEventListener('load', () => {
      loaderEl.classList.add('hide')
    })

    // 최초 호출!
    // SEARCH 버튼 클릭 시
    searchBtnEl.addEventListener('click', async () => {
      page = 1
      selectEl.addEventListener('select', async () => {
        findMovies()
      })
      findMovies()  
    }) 

    // input, ENTER 누르면
    inputEl.addEventListener('keypress', async (e) => {
      page = 1
      if(e.key === 'Enter') {
        selectEl.addEventListener('select', async () => {
          findMovies()
        })
      }
      if(e.key === 'Enter'){
        findMovies()
      }
    })
    
    async function findMovies () {
      if(moviesEl.innerHTML !== '') {
        moviesEl.innerHTML = ''
      }      
      year = selectEl.value
      title = inputEl.value
      // 로딩바
      loaderEl.classList.remove('hide')
      const movies = await getMovies(title, page, year)
      if(movies !== undefined) {
        renderMovies(movies)
        loaderEl.classList.add('hide') 
      } else {
        loaderEl.classList.add('hide') 
      }
    }

    async function getMovies(title, page, year) {
      const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&s=${title}&page=${page}&y=${year}`)
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
    function textLengthOverCut(txt, len = 20, lastTxt = "...") {
      if (txt.length > len) {
          txt = txt.substr(0, len) + lastTxt;
      }
      return txt;
    }

    // 무한스크롤
    let lastSection = document.querySelector('.lastsection')
    const io = new IntersectionObserver ((entries) => {
      if(entries[0].isIntersecting) {
        setTimeout(async () => {
          page += 1
          const movies = await getMovies(title, page, year)
          renderMovies(movies)
        }, 400)
      }
    })
    io.observe(lastSection)
})()


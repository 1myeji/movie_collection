;(async () => {
  // 초기화 코드들~
    const moviesEl = document.querySelector('.movies')
    const moreBtnEl = document.querySelector('.btn')
    const inputEl = document.querySelector('.movietitle')
    const searchBtnEl = document.querySelector('.searchbtn')
    const selectEl = document.querySelector('.form-select')
    const loaderEl = document.querySelector('.loader')
    const html = document.querySelector('html')
    let page = 1

    // $(window).load(function() {
    //   $('.loader').delay('3000').fadeout()
    // })
    // 로딩 중
    html.style.overflow = 'hidden' // 로딩 중 스크롤 방지
    window.addEventListener('load', () => {
      loaderEl.style.opacity = '0'
      html.style.overflow = 'auto' //스크롤 방지 해제
      setTimeout(() => {
        loaderEl.style.display = 'none'
      }, 400)
    })


    // 최초 호출!
    // SEARCH 버튼 클릭 시
    searchBtnEl.addEventListener('click', async () => {
      selectEl.addEventListener('select', async () => {
        findMovies()
      })
      findMovies()      
    }) 

    // input, ENTER 누르면
    inputEl.addEventListener('keypress', async (e) => {
      if(e.key === 'Enter') {
        selectEl.addEventListener('select', async () => {
          findMovies()
        })
      }
      if(e.key === 'Enter'){
        findMovies()
      }
    })
    
    async function findMovies (year) {
      if(moviesEl.innerHTML !== '') {
        moviesEl.innerHTML = ''
      }      
      year = selectEl.value
      title = inputEl.value
      const movies = await getMovies(title, page, year)
      renderMovies(movies)
    }

    async function getMovies(title, page = 1, year) {
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
    }

    // 제목 길면 ... 처리
    function textLengthOverCut(txt, len = 20, lastTxt = "...") {
      if (txt.length > len) {
          txt = txt.substr(0, len) + lastTxt;
      }
      return txt;
    }
})()

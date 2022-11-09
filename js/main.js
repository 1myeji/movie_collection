;(async () => {
    // 초기화 코드들~
    const moviesEl = document.querySelector('.movies')
    const movieEl = document.querySelector('.movie')
    const inputEl = document.querySelector('.movietitle')
    const searchBtnEl = document.querySelector('.searchbtn')
    const selectEl = document.querySelector('.form-select')
    const loaderEl = document.querySelector('.loader')
    let lastSection = document.querySelector('.lastsection')
    let page = 1
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
      const movies = await getMovies(title, page, year, id)
      // 검색했는데 결과가 없다면 로딩바 숨기기
      if(movies !== undefined) {
        renderMovies(movies)
        loaderEl.classList.add('hide') 
      } else {
        loaderEl.classList.add('hide') 
      }
    }
    
    // 상세페이지
    // movieEl.addEventListener('click', () => {
    //   func()
    // })

    // async function func (movies) {
    //   for (let i = 0; i < page * 8; i++) {
    //     if (document.querySelector('.movie: nth-child(i + 1)').addEventListener('click', () => {
    //       id = movies[i].imdbID 
    //     })) {
    //     }
    //   }
    //   const datas = await getMovie(id)
    //   detailMovies(datas)
    // }

    // async function getMovie(id) {
    //   const res = await fetch(`https://omdbapi.com/?apikey=7035c60c&i=${id}&plot=full`)
    //   const datas = await res.json()
    //   console.log(datas)
    //   return datas
    // }
    // function detailMovies (datas) {
    //   for(const data of datas) {
    //     const imgEl = document.createElement('img')
    //     imgEl.src = data.Poster
    //     const divEl = document.createElement('div')
    //     divEl.classList.add('detail')
    //     const titleEl = document.createElement('h1')
    //     titleEl.textContent = data.Title
    //     const releasedEl = document.createElement('p')
    //     releasedEl.textContent = data.Released
    //     releasedEl.textContent = data.Runtime
    //     releasedEl.textContent = data.Country
    //     divEl.append(titleEl, releasedEl)
    //     moviesEl.append(imgEl, divEl)
    //   }
    // }
    // 상세페이지 끝

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
    function textLengthOverCut(txt, len = 20, lastTxt = "...") {
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
          const movies = await getMovies(title, page, year, id)
          if(movies !== undefined) {
            renderMovies(movies)
            loaderEl.classList.add('hide') 
          } else {
            loaderEl.classList.add('hide') 
          }
        }, 200)
      }
    })
    io.observe(lastSection)
})()


const app = new Vue({
    el: '#app',
    data: {
        // current states
        states: {
            // loading
            loading: true,
            // view mode
            view: 'home',
            // current artist
            artist: null,
            // current song
            song: null,
            // search text
            search: ''
        },
        // all songs
        songs: [],
        // artists array
        artists: [],
        // titles array
        titles: []
    },
    // computed values
    computed: {
        // search results
        results() {
            // check search term
            if(this.states.search === '') { return null }
            // get search term in english
            const term_en = this.states.search.toLowerCase()
            // get search term in sinhala
            const term_si = sin_utf(this.states.search)
            // get
            // output object
            const output = { songs: [], artists: [] }
            // for each song and limited results
            for(let i = 0; (i < this.songs.length) && (output.songs.length < 10); i++) {
                // current song item
                const item = this.songs[i]
                // check with title
                if(item.title_en?.toLowerCase().includes(term_en)) {
                    // push to output
                    output.songs.push(item)
                }
            }
            // for each artist and limited results
            for(let i = 0; (i < this.artists.length) && (output.artists.length < 10); i++) {
                // current artist item
                const item = this.artists[i]
                // check with title
                if(item.name?.includes(term_si)) {
                    // push to output
                    output.artists.push(item)
                }
            }
            console.log(1)
            // return output
            return output
        }
    },
    // methods
    methods: {
        // method to sleep
        sleep(time = 500) {
            // return promise
            return new Promise(resolve => {
                // resolve after timeout
                setTimeout(resolve, time)
            })
        },
        // method to view home
        async viewHome() {
            // start loading
            this.states.loading = true
            // clear search
            this.states.search = ''
            // set view mode
            this.states.view = 'home'
            // loading sleep
            await this.sleep()
            // stop loading
            this.states.loading = false
        },
        // method to view artist
        async viewArtist(item) {
            // start loading
            this.states.loading = true
            // clear search
            this.states.search = ''
            // check artist type
            if(typeof item === 'string') {
                item = this.artists.find(art => art.name === item)
            }
            // set current artist
            this.states.artist = item
            // set view mode
            this.states.view = 'artist'
            // loading sleep
            await this.sleep()
            // stop loading
            this.states.loading = false
        },
        // method to view song
        async viewSong(id) {
            // start loading
            this.states.loading = true
            // set song by index
            this.states.song = this.songs[id]
            // clear search
            this.states.search = ''
            // set view mode
            this.states.view = 'song'
            // loading sleep
            await this.sleep()
            // stop loading
            this.states.loading = false
        }
    },
    // mount method
    async mounted() {
        // load all songs
        this.songs = await fetch('index.json').then(resp => resp.json())
        // map each song item
        this.songs = this.songs.map((item, index) => {
            // set sinhala title
            item.title_si = item.title.split('(')[0]
            // set english title
            item.title_en = item.title.split('(')[1]?.split(')')[0]
            // set item id
            item.id = index
            // return same item
            return item
        })
        // for each song
        for (let i = 0; i < this.songs.length; i++) {
            // current item
            const item = this.songs[i]
            // current title
            const title = item.title
            // push to titles array
            this.titles.push({ name: title, id: i })
            // get artist item by name
            const artist = this.artists.find(art => art.name === item.artist)
            // check artist item
            if (artist) {
                // push song id into artist
                artist.ids.push(i)
            } else {
                // create artist item
                this.artists.push({
                    name: item.artist,
                    ids: [i]
                })
            }
        }
        // sort artists by songs count
        this.artists = this.artists.sort((a, b) => a.ids.length > b.ids.length ? -1 : 1)
        // loading sleep
        await this.sleep()
        // stop loading
        this.states.loading = false
    }
})
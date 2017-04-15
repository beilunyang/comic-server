// http request
const axios = require('axios');

const instance = axios.create({
  baseURL: 'http://v2.api.dmzj.com',
  headers: {
    'User-Agent': 'Mozilla/5.0 (X11; U; Linux x86_64; zh-CN; rv:1.9.2.10) Gecko/20100922 Ubuntu/10.10 (maverick) Firefox/3.6.10',
  },
  timeout: 30000,
});

// 大概2387页 2387 * 15 = 35805本 
const getComicList = async(page = 0) => {
  const result = await instance.get(`/classify/0/1/${page}.json?channel=ios&version=2.1.9`);
  if (result.status >= 200 && result.status < 400) {
    return result.data;
  }
  throw new Error(`Error:request status ${result.status}`);
};

const getComic = async(mid) => {
  const result = await instance.get(`/comic/${mid}.json?channel=ios&version=2.1.9`);
  if (result.status >= 200 && result.status < 400) {
    return result.data;
  }
  throw new Error(`Error:request status ${result.status}`);
};

const getChapter = async(mid, cid) => {
  const result = await instance.get(`/chapter/${mid}/${cid}.json?channel=ios&version=2.1.9`);
  if (result.status >= 200 && result.status < 400) {
    return result.data;
  }
  throw new Error(`Error:request status ${result.status}`);
}

// mongodb
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/comic', {
  poolSize: 10,
});
const con = mongoose.connection;
con.on('error', () => console.error('mongodb connect fail'));
con.on('open', () => console.log('mongodb connect success'));


const ComicSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  origin_cover: {
    type: String,
    default: '',
  },
  cover: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  update_time: {
    type: Number,
    default: '',
  },
  types: {
    type: Array,
    default: [],
  },
  finished: {
    type: Boolean,
    default: true,
  },
  authors: {
    type: Array,
    default: [],
  },
});
const ChapterSchema = mongoose.Schema({
  comic_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
  },
  cate: {
    type: String,
    default: '',
  },
  origin_content: {
    type: Array,
    default: [],
  },
  content: {
    type: Array,
    default: [],
  }
});

ComicSchema.index({ title: 1, description: 1 }, { unique: true });
ChapterSchema.index({ comic_id: 1, cate: 1, title: 1 }, { unique: true });
const ComicModel = mongoose.model('Comic', ComicSchema);
const ChapterModel = mongoose.model('Chapter', ChapterSchema);
// id: 原漫画ID
const saveComic = async(comic, id) => {
  try {
    const result = await new ComicModel(comic).save();
    console.log(`漫画ID:${id} --> ${comic.title} 入库成功`);
    return result._id;
  } catch (e) {
    console.error(e.message);
    console.error(`${id} --> ${comic.title} 入库失败`);
  }
};

const saveChapter = async(chapter, id) => {
  try {
    await new ChapterModel(chapter).save();
    console.log(`漫画ID:${chapter.comic_id} --> 章节ID:${id} 入库成功`);
  } catch (e) {
    console.error(e.message);
    console.error(`漫画ID:${chapter.comic_id} --> 章节ID:${id} 入库失败`);
  }
};

// download
const fs = require('fs');
const mkdirp = require('mkdirp');

const download = async(url, options) => {
  try {
    const { filename, comic_name, chapter_name, isCover, host, cate } = options;
    const response = await instance.get(url, {
      headers: {
        referer: host,
      },
      responseType: 'stream',
    });
    if (!isCover) {
      mkdirp(`../comics/${comic_name}/${cate}/${chapter_name}`, (err) => {
        if (err) return console.error(err.stack);
        response.data.pipe(fs.createWriteStream(`../comics/${comic_name}/${cate}/${chapter_name}/${filename}`));
      });
    } else {
      mkdirp(`../comics/${comic_name}`, (err) => {
        if (err) return console.error(err.stack);
        response.data.pipe(fs.createWriteStream(`../comics/${comic_name}/${filename}`));
      });
    }
  } catch (e) {
    console.error(e.stack);
  }
};

//start
for (let i = 0; i < 2390; i++) {
  (async function () {
    try {
      var comics = await getComicList(i);
    } catch (e) {
      console.error(e.message);
      return;
    }
    // comics 数组为空，此时已经超过max page
    if (comics.length === 0) {
      process.exit(0);
    }
    for (let value of comics) {
      (async function () {
        try {
          var comic = await getComic(value.id);
        } catch (e) {
          console.error(e.message);
          return;
        }
        const ctypes = comic.types.map(type => type.tag_name);
        const cauthors = comic.authors.map(author => author.tag_name);
        const origin_cover = comic.cover;
        const result = origin_cover.match(/(^http:\/\/.+?\/).*\/(.+?$)/);
        const host = result[1];
        const filename = result[2];
        download(origin_cover, {
          filename,
          host,
          isCover: true,
          comic_name: comic.title,
        });
        const mdata = {
          title: comic.title,
          origin_cover,
          cover: `comics/${comic.id}/cover/${filename}`,
          description: comic.description,
          update_time: comic.last_updatetime,
          types: ctypes,
          finished: comic.status[0].tag_name === '已完结',
          authors: cauthors,
        };
        const comic_id = await saveComic(mdata, comic.id);
        if (!comic_id) {
          return;
        }
        const chapters = comic.chapters;
        for (let val of chapters) {
          (async function (){
            const cate = val.title;
            const data = val.data;
            for (let p of data) {
              try {
                var chapter = await getChapter(comic.id, p.chapter_id);
              } catch (e) {
                console.error(e.message);
                return;
              }
          
              const origin_content = chapter.page_url;
              const content = origin_content.map((url) => {
                const result = url.match(/(^http:\/\/.+?\/).*\/(.+?$)/);
                const filename = result[2];
                const host = result[1];
                const chapter_name = chapter.title;
                const comic_name = comic.title;
                download(url, {
                  isCover: false,
                  filename,
                  host,
                  comic_name,
                  chapter_name,
                  cate,
                });
                return `comics/${comic_name}/${cate}/${chapter_name}/${filename}`;
              });
              const cdata = {
                title: chapter.title,
                order: chapter.chapter_order,
                origin_content: chapter.page_url,
                content: content,
                comic_id,
                cate,
              };
              saveChapter(cdata, chapter.chapter_id);
            }
          })();
        }
      })();
    }
  })();    
}

// process.on('uncaughtException', err => console.error(err.stack));
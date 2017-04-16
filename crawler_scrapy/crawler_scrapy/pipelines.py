# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
import pymongo
import redis
import scrapy
import re
import os
from scrapy.exceptions import DropItem
# from scrapy.pipelines.images import ImagesPipeline
# from crawler_scrapy.settings import DATABASE, IMAGES_STORE
from crawler_scrapy.settings import DATABASE
from crawler_scrapy.items import ComicItem, ChapterItem

class MongoPipeline(object):
   def open_spider(self, spider):
      self.client = pymongo.MongoClient(DATABASE['host'], DATABASE['port'])
      db = self.client[DATABASE['db']]
      self.comic = db[DATABASE['comic_collection']]
      self.chapter = db[DATABASE['chapter_collection']]
      self.comic.create_index([('mid', pymongo.ASCENDING)], unique = True)
      self.chapter.create_index([('pid', pymongo.ASCENDING)], unique = True)
      

   def close_spider(self, spider):
      self.client.close()

   def process_item(self, item, spider):
      try:
         if isinstance(item, ComicItem):
            self.comic.insert(dict(item))
         elif isinstance(item, ChapterItem):
            # if item['ok']:
            #    del item['comic_name']
            #    del item['ok']
            #    self.chapter.insert(dict(item))
            #    item['ok'] = True
            self.chapter.insert(dict(item))
            item['ok'] = True
      except pymongo.errors.DuplicateKeyError:
         raise DropItem('Duplicate item found: %s' %item)
      except Exception as e:
         print(e)
         item['ok'] = False
      return item  

# class MyImagesPipeline(ImagesPipeline):
#    def get_media_requests(self, item, info):
#       if isinstance(item, ChapterItem):
#          for image_url in item['origin_images']:
#             host = re.match(r'(^http:\/\/.+?\/).*\/(.+?$)', image_url).group(1)
#             yield scrapy.Request(image_url, headers = { 'Referer': host })
#       elif isinstance(item, ComicItem):
#          host = re.match(r'(^http:\/\/.+?\/).*\/(.+?$)', item['origin_cover']).group(1)
#          yield scrapy.Request(item['origin_cover'], headers = { 'Referer': host })
         

#    def item_completed(self, results, item, info):
#       image_paths = []
#       urls = []
#       for ok, x in results:
#          if ok:
#             image_paths.append(x['path'])
#             urls.append(x['url'])


#       if isinstance(item, ChapterItem):
#          if not image_paths or len(image_paths) != len(results):
#             item['ok'] = False
#          else:
#             item['ok'] = True

#          item['images'] = []
#          for i in range(len(image_paths)):
#             filename = re.match(r'(^http:\/\/.+?\/).*\/(.+?$)', urls[i]).group(2)
#             src = '%s/%s' %(IMAGES_STORE, image_paths[i])
#             dist = '%s/%s/%s/%s' %(IMAGES_STORE, item['comic_name'], item['cate'], item['title'])
#             dist_file = '%s/%s' %(dist, filename)
#             if os.path.exists(dist):
#                os.rename(src, dist_file)
#             else:
#                os.makedirs(dist)
#                os.rename(src, dist_file)
#             item['images'].append('%s/%s/%s/%s' %(item['comic_name'], item['cate'], item['title'], filename))
#       elif isinstance(item, ComicItem):
#          for i in range(len(image_paths)):
#             filename = re.match(r'(^http:\/\/.+?\/).*\/(.+?$)', urls[i]).group(2)
#             src = '%s/%s' %(IMAGES_STORE, image_paths[i])
#             dist = '%s/%s' %(IMAGES_STORE, item['title'])
#             dist_file = '%s/%s' %(dist, filename)
#             if os.path.exists(dist):
#                os.rename(src, dist_file)
#             else:
#                os.makedirs(dist)
#                os.rename(src, dist_file)
#             item['cover'] = '%s/%s' %(item['title'], filename)
#       return item

   # https://segmentfault.com/q/1010000000413334
   # 重载了文档中没有提及的file_path方法，侵入性更强，但速度应该会更快
   # def file_path(self, request, response = None, info = None):
   #     ## start of deprecation warning block (can be removed in the future)
   #    def _warn():
   #       from scrapy.exceptions import ScrapyDeprecationWarning
   #       import warnings
   #       warnings.warn('ImagesPipeline.image_key(url) and file_key(url) methods are deprecated, '
   #                     'please use file_path(request, response=None, info=None) instead',
   #                     category=ScrapyDeprecationWarning, stacklevel=1)

   #    # check if called from image_key or file_key with url as first argument
   #    if not isinstance(request, Request):
   #       _warn()
   #       url = request
   #    else:
   #       url = request.url

   #    # detect if file_key() or image_key() methods have been overridden
   #    if not hasattr(self.file_key, '_base'):
   #       _warn()
   #       return self.file_key(url)
   #    elif not hasattr(self.image_key, '_base'):
   #       _warn()
   #       return self.image_key(url)
   #    ## end of deprecation warning block

   #    filename = re.match(r'(^http:\/\/.+?\/).*\/(.+?$)', url).group(2)

   #    return 'full/%s.jpg' % filename

class RedisPipeline(object):
   def open_spider(self, spider):
      pool = redis.ConnectionPool(host='127.0.0.1', port=6379)
      self.client = redis.Redis(connection_pool=pool)

   def close_spider(self, spider):
      pass

   def process_item(self, item, spider):
      if isinstance(item, ChapterItem):
         # 检测chapter item的ok状态
         if item['ok']:
            self.client.sadd('successChapter', item['pid'])
         else:
            self.client.sadd('failChapter', item['pid'])

      return item




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
from crawler_scrapy.settings import DATABASE
from crawler_scrapy.items import ComicItem, ChapterItem

class MongoPipeline(object):
   def open_spider(self, spider):
      self.client = pymongo.MongoClient(DATABASE['host'], DATABASE['port'])
      db = self.client[DATABASE['db']]
      self.comic = db[DATABASE['comic_collection']]
      self.chapter = db[DATABASE['chapter_collection']]
      self.comic.create_index([('mid', pymongo.ASCENDING)], unique = True)
      self.chapter.create_index([('pid', pymongo.ASCENDING), ('mid', pymongo.ASCENDING)], unique = True)
      

   def close_spider(self, spider):
      self.client.close()

   def process_item(self, item, spider):
      try:
         if isinstance(item, ComicItem):
            self.comic.insert(dict(item))
         elif isinstance(item, ChapterItem):
            self.chapter.insert(dict(item))
            item['ok'] = True
      except pymongo.errors.DuplicateKeyError:
         raise DropItem('Duplicate item found: %s' %item)
      except Exception as e:
         print(e)
         item['ok'] = False
      return item

class RedisPipeline(object):
   def open_spider(self, spider):
      pool = redis.ConnectionPool(host='localhost', port=6379)
      self.client = redis.Redis(connection_pool=pool)

   def close_spider(self, spider):
      pass

   def process_item(self, item, spider):
      if isinstance(item, ChapterItem):
         # 检测chapter item的ok状态
         if item['ok']:
            self.client.sadd('successChapter', '%d:%d' %(item['mid'], item['pid']))
         else:
            self.client.sadd('failChapter', '%d:%d' %(item['mid'], item['pid']))

      return item




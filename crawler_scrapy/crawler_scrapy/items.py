# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# http://doc.scrapy.org/en/latest/topics/items.html

from scrapy import Item, Field

class ComicItem(Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = Field()
    #cover = Field()
    origin_cover = Field()
    description = Field()
    update_time = Field()
    types = Field()
    finished = Field()
    authors = Field()
    mid = Field()

class ChapterItem(Item):
    title = Field()
    order = Field()
    cate = Field()
    origin_images = Field()
    #images = Field()
    mid = Field()
    pid = Field()
    # 不入库
    # comic_name = Field()
    ok = Field()

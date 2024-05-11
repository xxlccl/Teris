import { classDescriptor, printObj, propDescriptor } from "./Descriptor";

@classDescriptor("文章")
class Article {
    @propDescriptor("作者")
    author: string;

    @propDescriptor("密码")
    content: string;

    @propDescriptor("发表日期")
    date: Date;
}

const a = new Article();
a.author = "张三";
a.content = "今天天气真好";
a.date = new Date();

printObj(a);

import { Button } from 'antd';
import * as XLSX from 'xlsx';
import { readFile, selectFiles } from './utils';

const XlsxDemo = () => {
  const exportDemo = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(
      [
        {
          姓名: '张三',
          年龄: 1,
        },
        {
          姓名: '李四',
          年龄: 12,
          性别: '男',
        },
      ],
      {
        header: ['年龄', '姓名', '性别'],
      },
    );

    XLSX.utils.book_append_sheet(workbook, worksheet, 'demo', true);
    XLSX.writeFile(workbook, 'demo.xlsx');
  };

  const importDemo = async () => {
    const selectedFiles = await selectFiles();

    const files = await Promise.all(
      selectedFiles.map(async (item) => await readFile(item)),
    );

    const my_json = files.map((item) => {
      const workbook = XLSX.read(item, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData); // 在这里处理读取的数据
      return jsonData;
    });

    console.log(my_json);
  };

  return (
    <div>
      <h1>XlsxDemo</h1>
      <Button onClick={() => exportDemo()}>导出</Button>
      <Button onClick={() => importDemo()}>导入</Button>
    </div>
  );
};

export default XlsxDemo;

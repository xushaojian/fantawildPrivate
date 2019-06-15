import Mock from 'mockjs';

const { Random } = Mock;

const templateList = Mock.mock({
  code: '200',
  data: [{
    Id: 2,
    TemplateName: "事故报告(软件)",
    FileName: "事故报告(软件).docx",
    NameStyle: "报告名的命名规范",
    ReportCycle: "对报告填报周期的说明",
    Remarks: "对报告其他方面的说明",
    FilePath: "/resource/office/template/事故报告(软件).docx"
  },
  {
    Id: 3,
    TemplateName: "模板-2018115105832",
    FileName: "2018最新BAT 《前端必考面试》.docx",
    NameStyle: "报告名的命名规范",
    ReportCycle: "对报告填报周期的说明",
    Remarks: "对报告其他方面的说明",
    FilePath: "/resource/office/template/2018最新BAT 《前端必考面试》.docx"
  }
],
})

export default {
    templateList, 
}

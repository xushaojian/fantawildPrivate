import Mock from 'mockjs';

const { Random } = Mock;
const basic={
    'Id|1-100': 1,
    LoginName:  Random.cname(),
    UserName: Random.cname(),
    CardId: "172666",
    DepartmentName: "软件所",
    RoleName: "超级管理员",
    Remarks: "管理系统所有资源",
    LastLogin:'2018-09-13 10:11:34'
  } 

const sysUserList = Mock.mock({
  code: '200',
  data: {
    'list|1-100': [basic],
    pagination: {
        current: 1,
        total: 100,
      },
  }
})

export default {
    sysUserList, 
}

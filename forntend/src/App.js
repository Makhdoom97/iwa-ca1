import './App.css';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import AddUser from './components/AddUser';
import UserList from './components/UserList';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BackendUrl } from './url';

function App() {
  const { TabPane } = Tabs;
  const [data, setData] = useState();

  const getUser = () => {
    axios.get(`${BackendUrl}/user/list`).then((res) => {
      setData(
        res.data.map((user) => {
          return {
            ...{ key: user.email },
            ...user,
          };
        })
      );
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className='tab'>
      <Tabs
        defaultActiveKey='1'
        onChange={() => {
          getUser();
        }}>
        <TabPane tab='Add User' key='1'>
          <AddUser />
        </TabPane>
        <TabPane tab='Users List' key='2'>
          <UserList
            userData={data}
            reCallUserData={() => {
              getUser();
            }}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;

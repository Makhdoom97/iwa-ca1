import React, { useState } from 'react';
import { Form, Input, InputNumber, Button, message } from 'antd';

import axios from 'axios';
import { BackendUrl } from '../url';

function AddUser() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    await axios
      .post(`${BackendUrl}/user/add`, values.user)
      .then(() => {
        setLoading(false);
        message.success('User added successfully! ');
        form.resetFields();
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response.data.msg || 'Internal server error!');
      });
  };
  return (
    <div className='form_parent_div'>
      <div className='form'>
        <Form name='nest-messages' onFinish={onFinish} form={form}>
          <Form.Item
            name={['user', 'name']}
            label='Name'
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'email']}
            label='Email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Email is required',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'age']}
            label='Age'
            rules={[
              {
                type: 'number',
                min: 5,
                max: 99,
                required: true,
                message: 'Age must be between 5 and 99',
              },
            ]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name={['user', 'introduction']} label='Introduction'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              disabled={loading}>
              {loading ? 'Submiting...' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddUser;

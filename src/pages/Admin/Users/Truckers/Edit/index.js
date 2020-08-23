import React, { useEffect, useState, useRef } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { Form } from '@unform/web';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { InputTheme, Loading } from '~/components';
import api from '~/services/api';
import history from '~/services/history';
import documentTitle from '~/utils/documentTitle';

import { Container } from './styles';

export default function Edit({ match }) {
  const { params } = match;

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);

  const formRef = useRef(null);

  const [user, setUser] = useState({
    nickname: '',
    name: '',
    email: '',
    cpf: '',
    tel: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    async function getData() {
      setLoadingPage(true);

      const response = await api.get(`/users/${params.id}`);

      if (response.data.error) {
        toast.error(response.data.error);
        history.push('/users/trucker');
      }

      setUser({
        ...response.data,
        password: '',
        confirmPassword: '',
      });

      setLoadingPage(false);
    }

    getData();
  }, [params]);

  documentTitle(`Editar Caminhoneiro ${params.id}`);

  async function handleSubmit(data) {
    try {
      formRef.current.setErrors({});

      const schema = Yup.object().shape({
        nickname: Yup.string().required('Campo obrigatório'),
        name: Yup.string().required('Campo obrigatório'),
        email: Yup.string().email().required('Campo obrigatório'),
        cpf: Yup.string().required('Campo obrigatório'),
        tel: Yup.string().required('Campo obrigatório'),
      });

      const { password, confirmPassword } = data;

      if (password !== confirmPassword) {
        toast.error('Senhas não coincidem!');
        return;
      }

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading(true);

      let dataSend = data;

      if (!password) {
        const { nickname, name, email, cpf, tel } = data;
        dataSend = { nickname, name, email, cpf, tel };
      }

      const response = await api.put(`/users/${params.id}`, dataSend);

      if (response.data.success) {
        toast.success(response.data.success);
        history.push('/users/trucker');
        return;
      }

      toast.error(response.data.error);

      setLoading(false);
    } catch (err) {
      const validationErrors = {};

      if (err instanceof Yup.ValidationError) {
        err.inner.forEach((error) => {
          validationErrors[error.path] = error.message;
        });
        formRef.current.setErrors(validationErrors);
      }
    }
  }

  return (
    <Container className="animated fadeIn">
      <div className="container">
        <div className="mb-5 pb-5">
          <h1>Caminhoneiro #{params.id}</h1>
        </div>

        {loadingPage ? (
          <Loading />
        ) : (
          <Form onSubmit={handleSubmit} ref={formRef}>
            <div className="row mb-5">
              <div className="col-lg-4">
                <InputTheme
                  id="nickname"
                  name="nickname"
                  label="Nome de usuário"
                  type="text"
                  className="mb-5"
                  value={user.nickname}
                  onChange={(e) =>
                    setUser({ ...user, nickname: e.target.value })
                  }
                />
              </div>
              <div className="col-lg-4">
                <InputTheme
                  id="name"
                  name="name"
                  label="Nome"
                  type="text"
                  className="mb-5"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
              </div>
              <div className="col-lg-4">
                <InputTheme
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  className="mb-5"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div className="col-lg-6">
                <InputTheme
                  id="cpf"
                  name="cpf"
                  label="CPF"
                  type="text"
                  mask="999.999.999-99"
                  className="mb-5"
                  value={user.cpf}
                  onChange={(e) => setUser({ ...user, cpf: e.target.value })}
                />
              </div>
              <div className="col-lg-6">
                <InputTheme
                  id="tel"
                  name="tel"
                  label="Telefone"
                  type="tel"
                  mask="(99) 99999-9999"
                  className="mb-5"
                  value={user.tel}
                  onChange={(e) => setUser({ ...user, tel: e.target.value })}
                />
              </div>
              <div className="col-lg-6">
                <InputTheme
                  id="password"
                  name="password"
                  label="Senha"
                  type="password"
                  className="mb-5"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
              <div className="col-lg-6">
                <InputTheme
                  id="confirmPassword"
                  name="confirmPassword"
                  label="Confirmar senha"
                  type="password"
                  className="mb-5"
                  value={user.confirmPassword}
                  onChange={(e) =>
                    setUser({ ...user, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className={`btn btn-success ${
                  loading && 'disabled btn-loading'
                }`}
                disabled={loading}
              >
                {loading ? (
                  <AiOutlineLoading3Quarters color="#fff" size={14} />
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </Form>
        )}
      </div>
    </Container>
  );
}

Edit.propTypes = {
  match: PropTypes.object,
};

Edit.defaultProps = {
  match: {},
};

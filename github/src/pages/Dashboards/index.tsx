import React, { useState, useEffect, FormEvent } from "react";
import api from '../../Services/api'
import { Link } from 'react-router-dom'

import logoImg from "../../assets/logo.svg";

import { Title, Form, Repositories, Error } from "./style";
import { FiChevronRight } from 'react-icons/fi'

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  }
}


const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setinputError] = useState('')
  const [repositories, setRepostories] = useState<Repository[]>(() => {
    const storagedRepositories = localStorage.getItem('@GithubExplorer:repositories')
    if (storagedRepositories) {
      return JSON.parse(storagedRepositories)
    } else {
      return []
    }
  });



  useEffect(() => {
    localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
  }, [repositories])

  async function handleAddRepostory(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!newRepo) {
      setinputError('Digite o autor/nome do respositório')
      return
    }

    try {
      const response = await api.get<Repository>(`repos/${newRepo}`)
      const repository = response.data;

      setRepostories([...repositories, repository])
      setNewRepo('')
      setinputError('')
    } catch (err) {
      setinputError('Erro na busca por esse repositório')
    }
  }

  return (
    <>
      <img src={logoImg} alt="Github Explorer" />
      <Title>Explore repositórios no Github.</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepostory} >
        <input
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
          placeholder="Digite o nome do repositório"
        />
        <button type="submit">Pesquisar</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map(repository => (
          <Link key={repository.full_name} to={`/repository/${repository.full_name}`} >
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>
            <FiChevronRight size={20} />
          </Link>
        ))}
      </Repositories>
    </>
  );
};
export default Dashboard;

import {useState, useEffect} from 'react';

export function useJson(url:string, params = {}):any|null {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchJson(url).then(json => setData(json));
  }, [url]);
  return data;
};

function fetchJson(url:string, params = {}) {
  return fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    },
    ...params
  }).then(r => r.json());
}

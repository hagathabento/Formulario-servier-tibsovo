'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, RefreshCw, Database } from 'lucide-react';
import Link from 'next/link';

// Definição das perguntas para referência (pode ser importado de um arquivo compartilhado idealmente)
const questionsMap: Record<number, string> = {
  1: 'O que mais atrapalha a solicitação imediata do painel molecular?',
  2: 'Qual seria sua conduta hoje?',
  3: 'Seria candidato a Tibsovo®?',
  5: 'Feedback do evento'
};

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar submissões:', err);
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getAnswerText = (submission: any, questionId: number) => {
    const answer = submission.answers?.[questionId];
    if (!answer) return '-';
    
    // Tratamento especial para "Outro (especifique)"
    if (answer === 'Outro (especifique)') {
      const other = submission.answers?.[`other_${questionId}`];
      return `Outro: ${other || ''}`;
    }
    
    return answer;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-700">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 hover:bg-gray-800 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="text-[var(--tibsovo-orange)]" />
              Painel Administrativo
            </h1>
          </div>
          <button 
            onClick={fetchSubmissions}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--tibsovo-orange)] hover:bg-orange-600 rounded-lg font-medium transition-colors"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Atualizar
          </button>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-lg mb-6">
            Erro: {error}
            <p className="text-sm mt-2 opacity-80">Verifique se você configurou as tabelas no Supabase corretamente.</p>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900/50 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 border-b border-gray-700">Data</th>
                  <th className="p-4 border-b border-gray-700">Nome</th>
                  <th className="p-4 border-b border-gray-700 min-w-[200px]">Q1: Obstáculos</th>
                  <th className="p-4 border-b border-gray-700 min-w-[200px]">Q2: Conduta</th>
                  <th className="p-4 border-b border-gray-700">Q3: Candidato?</th>
                  <th className="p-4 border-b border-gray-700">Avaliação</th>
                  <th className="p-4 border-b border-gray-700 min-w-[200px]">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Carregando dados...
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Nenhuma submissão encontrada.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-gray-700/50 transition-colors">
                      <td className="p-4 text-sm whitespace-nowrap text-gray-400">
                        {formatDate(sub.created_at)}
                      </td>
                      <td className="p-4 font-medium text-white">
                        {sub.name}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {getAnswerText(sub, 1)}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {getAnswerText(sub, 2)}
                      </td>
                      <td className="p-4 text-sm">
                        <span className={
                          getAnswerText(sub, 3) === 'Sim' ? 'text-green-400 font-bold' : 
                          getAnswerText(sub, 3) === 'Não' ? 'text-red-400' : 'text-yellow-400'
                        }>
                          {getAnswerText(sub, 3)}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-yellow-400 font-bold">
                        {sub.answers?.[4] ? '★'.repeat(sub.answers[4]) : '-'}
                      </td>
                      <td className="p-4 text-sm text-gray-300">
                        {getAnswerText(sub, 5)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 text-xs text-gray-500 bg-gray-900/30 border-t border-gray-700 text-center">
            Total de registros: {submissions.length}
          </div>
        </div>
      </div>
    </div>
  );
}
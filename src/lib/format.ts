export function calcularIdade(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade--;
    }
    return idade;
}

export function formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR');
}

export function formatarDataInput(data: string): string {
    return new Date(data).toISOString().split('T')[0];
}
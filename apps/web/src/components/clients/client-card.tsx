import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, FileText, Briefcase } from "lucide-react";

export interface Client {
  id: string;
  name: string;
  cnpj: string;
  regime: string;
  status: 'Ativo' | 'Inativo';
  pendingTasks: number;
}

export function ClientCard({ client }: { client: Client }) {
  return (
    <Card className="hover:border-primary transition-colors cursor-pointer">
      <CardContent className="p-5 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-600 line-clamp-1" title={client.name}>{client.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
                <span>{client.cnpj}</span>
              </div>
            </div>
          </div>
          <Badge variant={client.status === 'Ativo' ? 'success' : 'default'}>{client.status}</Badge>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <Badge variant="default" className="text-[10px] bg-gray-100 text-gray-500">{client.regime}</Badge>
          
          <div className="flex items-center gap-1.5 text-xs font-medium text-warning">
            <Briefcase className="w-3.5 h-3.5" />
            <span>{client.pendingTasks} tarefas pendentes</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

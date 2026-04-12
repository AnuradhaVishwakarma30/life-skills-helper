import { useNavigate } from 'react-router-dom';
import { GraduationCap, Users, BookHeart, Sparkles } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex flex-col items-center justify-center px-6 py-12">
      <div className="animate-scale-in text-center mb-12">
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center mx-auto mb-6 shadow-lg animate-float">
          <BookHeart size={40} className="text-primary-foreground" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-3 tracking-tight">
          LearnAbility
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Building life skills, one step at a time
        </p>
        <div className="flex items-center justify-center gap-1 mt-3">
          {[...Array(3)].map((_, i) => (
            <Sparkles key={i} size={14} className="text-accent" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-lg w-full animate-slide-up">
        <button
          onClick={() => navigate('/teacher')}
          className="group relative bg-card rounded-3xl border-2 border-border p-8 flex flex-col items-center gap-4 shadow-sm hover:shadow-xl hover:border-primary/40 hover:scale-[1.03] transition-all duration-300"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <GraduationCap size={36} className="text-primary" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-1">Teacher</h2>
            <p className="text-sm text-muted-foreground">Enroll students & assign tasks</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/student')}
          className="group relative bg-card rounded-3xl border-2 border-border p-8 flex flex-col items-center gap-4 shadow-sm hover:shadow-xl hover:border-accent/40 hover:scale-[1.03] transition-all duration-300"
        >
          <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <Users size={36} className="text-accent" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-1">Student</h2>
            <p className="text-sm text-muted-foreground">Practice your assigned task</p>
          </div>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-10">
        Special Education Life Skills Trainer
      </p>
    </div>
  );
};

export default Index;

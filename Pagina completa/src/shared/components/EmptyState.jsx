// src/shared/components/EmptyState.jsx
// Componente reutilizable para estados vacíos en toda la aplicación.

const EmptyState = ({ icon = "📭", title, description, action }) => {
    return (
        <div className="text-center py-20 bg-base-200/50 rounded-[3rem] border-2 border-dashed border-base-content/10">
            <div className="text-8xl mb-6 opacity-20 select-none">{icon}</div>
            {title && <h3 className="text-2xl font-bold mb-3">{title}</h3>}
            {description && (
                <p className="max-w-md mx-auto opacity-50 mb-8 font-medium leading-relaxed">
                    {description}
                </p>
            )}
            {action && <div className="flex justify-center">{action}</div>}
        </div>
    );
};

export default EmptyState;

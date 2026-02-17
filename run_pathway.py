import sys
import os
sys.path.append(os.path.abspath(os.path.dirname(__file__)))

from pathway_pipeline.main_pipeline import run_pipeline
import pathway as pw
import os

OUTPUT_FILE = "./data/current_state.csv"

if __name__ == "__main__":
    print("Starting Pathway Engine...")
    table = run_pipeline()
    
    # Ensure output directory exists (it should)
    
    # Debug print
    # pw.debug.compute_and_print(table)
    
    # Write to CSV in streaming mode?
    # For demo persistence, CSV is easy.
    # We use `pw.io.csv.write`.
    pw.io.csv.write(table, OUTPUT_FILE)
    
    # Start the engine
    pw.run()
